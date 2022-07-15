let pokemonNames = [];
let pokemonData = [];
let pokemonSpecies = [];
let LIMIT = 48;
let offset = 0;


async function init() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    let response = await fetch(url);
    let allPokemonNames = await response.json();
    pokemonNames.push(allPokemonNames);
    console.log(allPokemonNames);
    loadPokemonData();
}


async function loadPokemonData() {
    await getPokemonData();
    await getPokemonSpecies();
    renderOnePokemon();
    removeLoadingScreen()
}


async function getPokemonData() {
    for (let i = offset; i < offset + LIMIT; i++) {
        let url = pokemonNames[0]['results'][i]['url'];
        let response = await fetch(url);
        let data = await response.json();
        pokemonData.push(data);
    }
}


async function getPokemonSpecies() {
    for (let i = offset; i < offset + LIMIT; i++) {
        let url = pokemonData[i]['species']['url'];
        let response = await fetch(url);
        let species = await response.json();
        pokemonSpecies.push(species);
    }
}


function renderOnePokemon() {
    for (let i = offset; i < offset + LIMIT; i++) {
        const onePokemon = pokemonData[i];
        document.getElementById('container').innerHTML += /*html*/`
        <div class="pokemon-card-small-box d-f jc-c ai-c">
            <div id="pokemon-card-small${i}" class="pokemon-card-small d-f jc-sa fd-c bg-small">
                <div class="d-f jc-sb ai-c">
                    <h2 class="fit">${onePokemon['name']}</h2>
                    <span class="fit pokemon-id">#${onePokemon['id']}</span>
                </div>
                <div class="d-f jc-sb ai-c">
                    <div id="pokemon-types${i}" class="d-f fd-c fit"></div>
                    <img class="pokemon-img-small" src="${onePokemon['sprites']['other']['dream_world']['front_default']}">
                </div>
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
    let content = document.getElementById('container');

    if (content.offsetHeight + content.scrollTop >= content.scrollHeight) {
        offset += LIMIT;
        LIMIT = 4;
        loadPokemonData();
    }
}

function showLoadingScreen() {
    document.getElementById('loading').classList.remove('d.none');
}


function removeLoadingScreen() {
    document.getElementById('loading').classList.add('d-none');
}