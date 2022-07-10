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
        <div>
        <h2>${pokemonData['name']}</h2>
        <div id="pokemon-type${i}"></div>
        <img src="${pokemonData['sprites']['other']['dream_world']['front_default']}">
        </div>
        `;
    addTypesOfPokemon(i, pokemonData);
}


function addTypesOfPokemon(i, pokemonData) {
    for (let t = 0; t < pokemonData['types'].length; t++) {
        let type = pokemonData['types'][t]['type']['name'];
        document.getElementById(`pokemon-type${i}`).innerHTML += /*html*/`
            <span>${type}</span>
            `;
    }
}