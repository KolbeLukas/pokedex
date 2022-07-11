let currentPokemon;

async function init() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    let response = await fetch(url);
    let allPokemon = await response.json();

    loadPokemonNames(allPokemon);
}


function loadPokemonNames(allPokemon) {
    for (let i = 0; i < 20 /*allPokemon['results'].length*/; i++) {
        let pokemonName = allPokemon['results'][i]['name'];
        loadPokemonData(i, pokemonName);
    }
}


async function loadPokemonData(i, pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    let response = await fetch(url);
    let pokemonData = await response.json();
    renderOnePokemon(i, pokemonData);
}


function renderOnePokemon(i, pokemonData) {
    document.getElementById('container').innerHTML += /*html*/`
        <div id="pokemon-card-small${i}" class="pokemon-card-small bg-small">
        <h2>${pokemonData['name']}</h2>
        <span>#${pokemonData['id']}</span>
        <div id="pokemon-types${i}"></div>
        <img class="pokemon-img-small" src="${pokemonData['sprites']['other']['dream_world']['front_default']}">
        </div>
        `;
    addTypesOfPokemon(i, pokemonData);
    addBackgroundToCard(i);
}


function addTypesOfPokemon(i, pokemonData) {
    for (let t = 0; t < pokemonData['types'].length; t++) {
        let type = pokemonData['types'][t]['type']['name'];
        document.getElementById(`pokemon-types${i}`).innerHTML += /*html*/`
            <span>${type}</span>
            `;
        addTypeColor(i);
    }
}


function addTypeColor(i) {
    let types = document.getElementById(`pokemon-types${i}`);
    let type = types.lastElementChild;
    type.classList.add(type.innerHTML);
}


function addBackgroundToCard(i) {
    let types = document.getElementById(`pokemon-types${i}`);
    let firstType = types.firstElementChild;
    if (firstType.innerHTML.indexOf('grass') != -1) {
        document.getElementById(`pokemon-card-small${i}`).classList.add('bg-small-green');
    }
}