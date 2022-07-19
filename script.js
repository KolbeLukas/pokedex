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
                        <img class="pokemon-img-small" src="${onePokemon['sprites']['other']['dream_world']['front_default']}"
                            onerror="this.onerror=null; this.src='${onePokemon['sprites']['other']['home']['front_default']}'">
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
/* TOP SECTION */

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


/* BOTTOM SECTION */

function addOnclickToNavElements(i) {
    document.getElementById('about').setAttribute('onclick', `renderCoreInfos(${i})`);
    document.getElementById('base-stats').setAttribute('onclick', `renderBaseStats(${i})`);
    document.getElementById('evolution').setAttribute('onclick', `renderEvolutionList(${i})`);
    renderCoreInfos(i);
}


function removeActiveClass() {

}

/* ABOUT */

function renderCoreInfos(i) {
    document.getElementById('about').classList.add('active');
    document.getElementById('evolution').classList.remove('active');
    document.getElementById('base-stats').classList.remove('active');
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
            <tr>
                <td class="w-33 light">Capture-Rate</td>
                <td class="tt-c" id="capture-rate"></td>
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
        </table>`;
    addAbilities(i);
    addGenderRate(i);
    addEggGroups(i);
    addCaptureRate(i);
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

        document.getElementById('male').innerHTML = `${male}%`;
        document.getElementById('female').innerHTML = `${female}%`;
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


function addCaptureRate(i) {
    let captureRate = pokemonSpecies[i]['capture_rate'];
    let ratePercent = (captureRate * 100) / 255;

    document.getElementById('capture-rate').innerHTML = `${ratePercent.toFixed(2)}%`;
}

/* BASE STATS */

function renderBaseStats(i) {
    document.getElementById('about').classList.remove('active');
    document.getElementById('evolution').classList.remove('active');
    document.getElementById('base-stats').classList.add('active');
    document.getElementById('details-content').innerHTML = /*html*/`
        <table class="w-100">
            <tr>
                <td class="w-20 light">HP</td>
                <td class="ta-r">${pokemonData[i]['stats'][0]['base_stat']}</td>
                <td class="pi-8">
                    <div class="stats-bar-bg">
                        <div id="stat-bar${0}" class="stats-bar"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="w-20 light">Attack</td>
                <td class="ta-r">${pokemonData[i]['stats'][1]['base_stat']}</td>
                <td class="pi-8">
                    <div class="stats-bar-bg">
                        <div id="stat-bar${1}" class="stats-bar"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="w-20 light">Defense</td>
                <td class="ta-r">${pokemonData[i]['stats'][2]['base_stat']}</td>
                <td class="pi-8">
                    <div class="stats-bar-bg">
                        <div id="stat-bar${2}" class="stats-bar"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="w-20 light">Sp. Atk.</td>
                <td class="ta-r">${pokemonData[i]['stats'][3]['base_stat']}</td>
                <td class="pi-8">
                    <div class="stats-bar-bg">
                        <div id="stat-bar${3}" class="stats-bar"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="w-20 light">Sp. Def.</td>
                <td class="ta-r">${pokemonData[i]['stats'][4]['base_stat']}</td>
                <td class="pi-8">
                    <div class="stats-bar-bg">
                        <div id="stat-bar${4}" class="stats-bar"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="w-20 light">Speed</td>
                <td class="ta-r">${pokemonData[i]['stats'][5]['base_stat']}</td>
                <td class="pi-8">
                    <div class="stats-bar-bg">
                        <div id="stat-bar${5}" class="stats-bar"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="w-20 light">Total</td>
                <td id="total" class="ta-r" style="width: 38px"></td>
                <td class="pi-8">
                    <div class="stats-bar-bg">
                        <div id="total-bar" class="stats-bar"></div>
                    </div>
                </td>
            </tr>
        </table>`;
    renderStatBars(i);
    renderTotal(i);
}


function renderStatBars(i) {
    let maxStat = [255, 190, 250, 194, 250, 200];

    for (let j = 0; j < maxStat.length; j++) {
        const max = maxStat[j];
        let stat = pokemonData[i]['stats'][j]['base_stat'];
        let percent = (stat * 100) / max;

        document.getElementById(`stat-bar${j}`).style.width = `${percent}%`;
        if (percent > 50) {
            document.getElementById(`stat-bar${j}`).style.backgroundColor = "rgb(90 175 105)";
        } else {
            document.getElementById(`stat-bar${j}`).style.backgroundColor = "rgb(255 56 11)";
        }
    }
}


function renderTotal(i) {
    const stats = pokemonData[i]['stats'];
    let sum = 0;
    stats.forEach(element => {
        sum += element.base_stat;
    });
    document.getElementById('total').innerHTML = sum;
    let percent = (sum * 100) / 1125;
    document.getElementById('total-bar').style.width = `${percent}%`;
    if (percent > 50) {
        document.getElementById('total-bar').style.backgroundColor = "rgb(90 175 105)";
    } else {
        document.getElementById('total-bar').style.backgroundColor = "rgb(255 56 11)";
    }
}


async function renderEvolutionList(i) {
    document.getElementById('about').classList.remove('active');
    document.getElementById('base-stats').classList.remove('active');
    document.getElementById('evolution').classList.add('active');
    await getEvolutionData(i);
}


async function getEvolutionData(i) {
    let url = pokemonSpecies[i]['evolution_chain']['url'];
    let response = await fetch(url);
    let evolution = await response.json();
    let evolutionOne = evolution['chain']['evolves_to'];

    if (evolutionOne.length >= 1) {
        let base = evolution['chain']['species']['name'];
        getBasePokemon(base);
        for (let f = 0; f < evolutionOne.length; f++) {
            let first = evolutionOne[f]['species']['name'];
            let evolutionTwo = evolutionOne[f]['evolves_to'];
            getFirstEvolution(first);
            if (evolutionTwo.length >= 1) {
                console.log('evolution2');
            } else {
                console.log('only one')
            }
        }
    } else {
        console.log('single')
    }
}


async function getBasePokemon(base) {
    for (let b = 0; b < pokemonNames[0]['results'].length; b++) {
        if (pokemonNames[0]['results'][b]['name'] === base) {
            let url = pokemonNames[0]['results'][b]['url'];
            let response = await fetch(url);
            let data = await response.json();
            document.getElementById('details-content').innerHTML = /*html*/`
            <img class="evol-img" src="${data['sprites']['other']['dream_world']['front_default']}"
                onerror="this.onerror=null; this.src='${data['sprites']['other']['home']['front_default']}'">`;
        }
    }
}


async function getFirstEvolution(first) {
    for (let e = 0; e < pokemonNames[0]['results'].length; e++) {
        if (pokemonNames[0]['results'][e]['name'] === first) {
            let url = pokemonNames[0]['results'][e]['url'];
            let response = await fetch(url);
            let data = await response.json();
            document.getElementById('details-content').innerHTML += /*html*/`
            <img class="evol-img" src="${data['sprites']['other']['dream_world']['front_default']}"
                onerror="this.onerror=null; this.src='${data['sprites']['other']['home']['front_default']}'">`;
        }
    }
}