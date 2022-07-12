let pokemonData = [];
let LIMIT = 50;
let offset = 0;

async function init() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    let response = await fetch(url);
    let allPokemon = await response.json();
    loadPokemonData(allPokemon);
}


async function loadPokemonData(allPokemon) {
    for (let i = offset; i < offset + LIMIT; i++) {
        let url = allPokemon['results'][i]['url'];
        let response = await fetch(url);
        let pokemonData = await response.json();
        renderOnePokemon(i, pokemonData);
    }
}


function renderOnePokemon(i, pokemonData) {
    document.getElementById('container').innerHTML += /*html*/`
        <div id="pokemon-card-small${i}" class="pokemon-card-small bg-small">
            <div class="pokemon-card-top">
                <h2 class="fit">${pokemonData['name']}</h2>
                <span class="fit pokemon-id">#${pokemonData['id']}</span>
            </div>
            <div class="pokemon-card-bottom">
                <div id="pokemon-types${i}" class="pokemon-types fit"></div>
                <img class="pokemon-img-small" src="${pokemonData['sprites']['other']['dream_world']['front_default']}">
            </div>
        </div>
        `;
    addTypesOfPokemon(i, pokemonData);
    addBackgroundToCard(i, pokemonData);
}


function addTypesOfPokemon(i, pokemonData) {
    for (let t = 0; t < pokemonData['types'].length; t++) {
        let type = pokemonData['types'][t]['type']['name'];
        document.getElementById(`pokemon-types${i}`).innerHTML += /*html*/`
            <span class="fit">${type}</span>
            `;
        addTypeColor(i);
    }
}


function addTypeColor(i) {
    let types = document.getElementById(`pokemon-types${i}`);
    let type = types.lastElementChild;
    type.classList.add(type.innerHTML);
}


async function addBackgroundToCard(i, pokemonData) {
    let url = pokemonData['species']['url'];
    let response = await fetch(url);
    let pokemonSpecies = await response.json();
    let color = pokemonSpecies['color']['name'];
    document.getElementById(`pokemon-card-small${i}`).classList.add(`bg-small-${color}`);
}


function nextPokemons() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        offset += LIMIT;
        LIMIT = 5;
        document.getElementById('body').classList.add('n-scroll');
        // document.getElementById('loading').classList.remove('d-none');
        init();
        setTimeout(remove, 1000);
    }
}

function remove() {
    document.getElementById('body').classList.remove('n-scroll');
    // document.getElementById('loading').classList.add('d-none');
}
