let pokemonData = [];
let pokemonSpecies = [];
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
        let urlData = allPokemon['results'][i]['url'];
        let responseData = await fetch(urlData);
        let data = await responseData.json();
        pokemonData.push(data);
        let urlSpecies = pokemonData[i]['species']['url'];
        let response = await fetch(urlSpecies);
        let species = await response.json();
        pokemonSpecies.push(species);
    }
    document.getElementById('b').classList.remove('n-scroll');
    renderOnePokemon();
}


function renderOnePokemon() {
    for (let i = offset; i < offset + LIMIT; i++) {
        const onePokemon = pokemonData[i];
        
    document.getElementById('container').innerHTML += /*html*/`
        <div id="pokemon-card-small${i}" class="pokemon-card-small bg-small">
            <div class="pokemon-card-top">
                <h2 class="fit">${onePokemon['name']}</h2>
                <span class="fit pokemon-id">#${onePokemon['id']}</span>
            </div>
            <div class="pokemon-card-bottom">
                <div id="pokemon-types${i}" class="pokemon-types fit"></div>
                <img class="pokemon-img-small" src="${onePokemon['sprites']['other']['dream_world']['front_default']}">
            </div>
        </div>
        `;
    addTypesOfPokemon(i);
    addBackgroundToCard(i);
    }
}


function addTypesOfPokemon(i) {
    for (let t = 0; t < pokemonData[i]['types'].length; t++) {
        let type = pokemonData[i]['types'][t]['type']['name'];
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


async function addBackgroundToCard(i) {
    let color = pokemonSpecies[i]['color']['name'];
    document.getElementById(`pokemon-card-small${i}`).classList.add(`bg-small-${color}`);
}


function nextPokemons() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        document.getElementById('b').classList.add('n-scroll');
        offset += LIMIT;
        LIMIT = 3;
        init();
    }
}