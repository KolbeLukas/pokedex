let pokemonNames = [];
let currentPokemon;

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    let response = await fetch(url);
    let allPokemon = await response.json();

    loadPokemonByName(allPokemon);
}


function loadPokemonByName(allPokemon) {
    for (let i = 0; i < 20 /*allPokemon['results'].length*/; i++) {
        let onePokemon = allPokemon['results'][i]['name'];
        pokemonNames.push(onePokemon);
        document.getElementById('container').innerHTML += /*html*/`
            <h2>${onePokemon}</h2>`;
    } 
}