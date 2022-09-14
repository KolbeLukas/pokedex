let pokemonNames;
let allPokemons;
let pokemonData = [];
let pokemonSpecies = [];
let LIMIT = 48;
let offset = 0;


async function init() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=898&offset=0';
    let response = await fetch(url);
    let allPokemonNames = await response.json();
    allPokemons = allPokemonNames['results'];
    loadAllPokemons(allPokemons);
}

function loadAllPokemons(allPokemons) {
    pokemonNames = allPokemons;
    loadPokemonData();
}


function showLoadingScreen() {
    document.getElementById('loading').classList.remove('d-none');
}

function removeLoadingScreen() {
    document.getElementById('loading').classList.add('d-none');
}


async function loadPokemonData() {
    await getPokemonData();
    await getPokemonSpecies();
    renderOnePokemonBox();
    removeLoadingScreen();
}

async function getPokemonData() {
    for (let i = offset; i < offset + LIMIT; i++) {
        let url = pokemonNames[i]['url'];
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


function renderOnePokemonBox() {
    for (let i = offset; i < offset + LIMIT; i++) {
        const onePokemon = pokemonData[i];
        document.getElementById('container').innerHTML += renderOnePokemonBoxStructure(i, onePokemon);
        addPokemonImg(onePokemon, i);
        addTypesOfPokemon(i);
        addBackgroundToCard(i);
    }
}

function addPokemonImg(onePokemon, i) {
    if (onePokemon['sprites']['other']['dream_world']['front_default'] == null) {
        document.getElementById(`pokemon-img${i}`).src = onePokemon['sprites']['other']['home']['front_default'];
    } else {
        document.getElementById(`pokemon-img${i}`).src = onePokemon['sprites']['other']['dream_world']['front_default'];
    }
}

function addTypesOfPokemon(i) {
    for (let t = 0; t < pokemonData[i]['types'].length; t++) {
        let type = pokemonData[i]['types'][t]['type']['name'];

        document.getElementById(`pokemon-types${i}`).innerHTML += /*html*/`
            <span class="fit type">${type}</span>`;
        addTypeColor(i);
    }
}

function addTypeColor(i) {
    let types = document.getElementById(`pokemon-types${i}`);
    let type = types.lastElementChild;
    type.classList.add(type.innerHTML);
}

function addBackgroundToCard(i) {
    let color = pokemonSpecies[i]['color']['name'];
    document.getElementById(`pokemon-card-small${i}`).classList.add(`bg-small-${color}`);
}


function loadNextPokemons() {
    let content = document.getElementById('container');
    if (scrolledToBottom(content) && noSearching()) {
        setLimitOfNewLoadedPokemon();
        loadPokemonData();
    }
}

function scrolledToBottom(content) {
    return content.offsetHeight + content.scrollTop >= content.scrollHeight;
}

function noSearching() {
    return !document.getElementById('search').disabled;
}

function setLimitOfNewLoadedPokemon() {
    if (pokemonNames.length - 8 >= (offset + LIMIT)) {
        offset += LIMIT;
        LIMIT = 8;
    } else {
        offset += LIMIT;
        LIMIT = pokemonNames.length - offset;
    }
}


let timeout = null;
function searchPokemon() {
    document.getElementById('not-found').classList.add('d-none');
    closeDetailsOverlay();
    clearTimeout(timeout);
    showLoadingScreen();
    timeout = setTimeout(loadSearchedPokemons, 1500);
}

async function loadSearchedPokemons() {
    document.getElementById('search').disabled = true;
    claerPokemonDatas();
    getSearchedPokemonData();
    setMaxLoadedPokemon();
    await loadPokemonData();
    pokemonFoundCheck();
    document.getElementById('search').disabled = false;
}

function claerPokemonDatas() {
    document.getElementById('container').innerHTML = '';
    pokemonNames = [];
    pokemonData = [];
    pokemonSpecies = [];
}

function getSearchedPokemonData() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    for (let i = 0; i < allPokemons.length; i++) {
        let name = allPokemons[i]['name'];
        if (name.indexOf(search) == 0 && name.includes(search)) {
            pokemonNames.push(allPokemons[i]);
        }
    }
}

function setMaxLoadedPokemon() {
    offset = 0;
    LIMIT = 48;
    if (LIMIT > pokemonNames.length) {
        LIMIT = pokemonNames.length;
    }
}

function pokemonFoundCheck() {
    if (document.getElementById('container').innerHTML == '') {
        document.getElementById('not-found').classList.remove('d-none');
    }
}


function openImpressum() {
    document.getElementById('impressum').classList.remove('d-none');
}

function closeImpressum() {
    document.getElementById('impressum').classList.add('d-none');
}

function stopPropagation(event) {
    event.stopPropagation();
}