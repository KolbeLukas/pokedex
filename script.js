let pokemonNames = [];
let pokemonData = [];
let pokemonSpecies = [];
let LIMIT = 50;
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
    document.getElementById('body').classList.remove('n-scroll');
    renderOnePokemon();
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
        document.getElementById('body').classList.add('n-scroll');
        offset += LIMIT;
        LIMIT = 3;
        loadPokemonData();
    }
}