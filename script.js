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
    loadPokemonData();
}


async function loadPokemonData() {
    await getPokemonData();
    await getPokemonSpecies();
    renderOnePokemon();
    removeLoadingScreen();
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
                <div onclick="openDetailsOverlay(${i})" id="pokemon-card-small${i}" class="pokemon-card-small d-f jc-sa fd-c bg-small pointer">
                    <div class="d-f jc-sb ai-c">
                        <h2 class="tt-c">${onePokemon['name']}</h2>
                        <span class="pokemon-id">#${onePokemon['id']}</span>
                    </div>
                    <div class="d-f jc-sb ai-c">
                        <div id="pokemon-types${i}" class="d-f fd-c"></div>
                        <img class="pokemon-img-small" src="${onePokemon['sprites']['other']['dream_world']['front_default']}">
                    </div>
                </div>
            </div>`;
        addTypesOfPokemon(i);
        addBackgroundToCard(i);
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


function nextPokemons() {
    let content = document.getElementById('container');

    if (content.offsetHeight + content.scrollTop >= content.scrollHeight) {
        offset += LIMIT;
        LIMIT = 8;
        loadPokemonData();
    }
}

function showLoadingScreen() {
    document.getElementById('loading').classList.remove('d.none');
}


function removeLoadingScreen() {
    document.getElementById('loading').classList.add('d-none');
}


/* DETAILS OVERLAY */

function openDetailsOverlay(i) {
    document.getElementById('details-overlay').classList.remove('d-none');
    document.getElementById('name').innerHTML = pokemonData[i]['name'];
    document.getElementById('id').innerHTML = `#${pokemonData[i]['id']}`;
    document.getElementById('img').src = pokemonData[i]['sprites']['other']['dream_world']['front_default'];
    addTypesOfPokemonOverlay(i);
    addOnclickToNavElements(i);
}


function closeDetailsOverlay() {
    document.getElementById('details-overlay').classList.add('d-none');
    document.getElementById('types').innerHTML = '';
}

function addTypesOfPokemonOverlay(i) {
    for (let t = 0; t < pokemonData[i]['types'].length; t++) {
        let type = pokemonData[i]['types'][t]['type']['name'];

        document.getElementById('types').innerHTML += /*html*/`
            <span class="fit type">${type}</span>`;
        addTypeColorOverlay();
        addBackgroundToOverlay(i);
    }
}

function addTypeColorOverlay() {
    let types = document.getElementById('types');
    let type = types.lastElementChild;
    type.classList.add(type.innerHTML);
}

function addBackgroundToOverlay(i) {
    let color = pokemonSpecies[i]['color']['name'];
    document.getElementById('overlay-top').style.backgroundImage = `url(img/bg-big-${color}.png)`;
    document.getElementById('overlay-top').style.backgroundColor = `var(--${color})`;
}


function addOnclickToNavElements(i) {
    document.getElementById('about').setAttribute('onclick', `renderCoreInfos(${i})`);
    document.getElementById('base-stats').setAttribute('onclick', `renderBaseStats(${i})`);
    document.getElementById('evolution').setAttribute('onclick', `renderEvolutionList(${i})`);
    renderCoreInfos(i);
}


function renderCoreInfos(i) {
    document.getElementById('details-content').innerHTML = /*html*/`
        <table class="w-100">
            <tr>
                <td class="w-33 light">Species</td>
                <td>${pokemonSpecies[i]['genera'][7]['genus']}</td>
            </tr>
            <tr>
                <td class="w-33 light">Height</td>
                <td>${pokemonData[i]['height'] / 10} m</td>
            </tr>
            <tr>
                <td class="w-33 light">Weight</td>
                <td>${pokemonData[i]['weight'] / 10} kg</td>
            </tr>
            <tr>
                <td class="w-33 light">Abilities</td>
                <td class="tt-c" id="abilities"></td>
            </tr>
        </table>
        <h4>Breeding</h4>
        <table class="w-100">
            <tr>
                <td class="w-33 light">Gender</td>
                <td id="gender">
                    <img src="img/male.png">
                    <span id="male" class="tt-c">10%</span>
                    <img class="female-img" src="img/female.png">
                    <span id="female" class="tt-c">90%</span>
                </td>
            </tr>
            <tr>
                <td class="w-33 light">Egg Group</td>
                <td class="tt-c" id="egg-groups"></td>
            </tr>
        </table>
        <h4>Description</h4>
        <!-- <span>${pokemonSpecies}</span> -->`;
    addAbilities(i);
    addGenderRate(i);
    addEggGroups(i);
}


function addAbilities(i) {
    let abilitiesData = pokemonData[i]['abilities'];
    let abilities = [];

    for (let a = 0; a < abilitiesData.length; a++) {
        let ability = abilitiesData[a]['ability']['name'];
        abilities.push(ability);
    }
    document.getElementById('abilities').innerHTML = abilities.join(', ');
}


function addGenderRate(i) {
    if (pokemonSpecies[i]['gender_rate'] == -1) {
        document.getElementById('gender').innerHTML = 'Genderless';
    } else {
        let female = (pokemonSpecies[i]['gender_rate'] * 100) / 8;
        let male = ((8 - pokemonSpecies[i]['gender_rate']) * 100) / 8;

        document.getElementById('male').innerHTML = `${male} %`;
        document.getElementById('female').innerHTML = `${female} %`;
    }
}


function addEggGroups(i) {
    let eggGroupsData = pokemonSpecies[i]['egg_groups'];
    let eggGroups = [];

    for (let e = 0; e < eggGroupsData.length; e++) {
        let eggGroup = eggGroupsData[e]['name'];
        eggGroups.push(eggGroup);
    }
    document.getElementById('egg-groups').innerHTML = eggGroups.join(', ');
}