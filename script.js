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
    pokemonNames = allPokemons;
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
                        <img id="pokemon-img${i}" class="pokemon-img-small">
                    </div>
                </div>
            </div>`;
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


function nextPokemons() {
    let content = document.getElementById('container');
    console.log('srolled')
    if (content.offsetHeight + content.scrollTop >= content.scrollHeight) {
        if (pokemonNames.length - 8 >= (offset + LIMIT)){
            offset += LIMIT;
            LIMIT = 8;
        } else {
            offset += LIMIT;
            LIMIT = pokemonNames.length - offset;
        }
        loadPokemonData();
    }
}

function showLoadingScreen() {
    document.getElementById('loading').classList.remove('d-none');
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
    if (pokemonData[i]['sprites']['other']['dream_world']['front_default'] == null) {
        document.getElementById('img').src = pokemonData[i]['sprites']['other']['home']['front_default'];
    } else {
        document.getElementById('img').src = pokemonData[i]['sprites']['other']['dream_world']['front_default'];
    }
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


async function searchPokemon() {
    document.getElementById('container').innerHTML = '';
    document.getElementById('search').disabled = true;
    showLoadingScreen();
    pokemonNames = [];
    pokemonData = [];
    pokemonSpecies = [];
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    for (let i = 0; i < allPokemons.length; i++) {
        let name = allPokemons[i]['name'];
        if (name.indexOf(search) == 0 && name.includes(search)) {
            pokemonNames.push(allPokemons[i]);
        }
    }
    offset = 0;
    LIMIT = 48;
    if (LIMIT > pokemonNames.length) {
        LIMIT = pokemonNames.length;
    }
    console.log(pokemonNames)
    console.log(pokemonData)
    console.log(pokemonSpecies)
    console.log('limit', LIMIT)
    console.log('off', offset)
    await loadPokemonData();
    document.getElementById('search').disabled = false;
}


/* BOTTOM SECTION */

function addOnclickToNavElements(i) {
    document.getElementById('about').setAttribute('onclick', `renderCoreInfos(${i})`);
    document.getElementById('base-stats').setAttribute('onclick', `renderBaseStats(${i})`);
    document.getElementById('evolution').setAttribute('onclick', `renderEvolutionList(${i})`);
    renderCoreInfos(i);
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
    document.getElementById('details-content').innerHTML = /*html*/`
    <h4>Evolution Chain</h4>
    <div id="first-evolution-step" class="d-f jc-sa ai-c">
        <div class="w-33 d-f jc-c" id="evolution0"></div>
        <img src="img/arrow-evolution.png">
        <div class="w-33 d-f jc-c" id="evolution1"></div>
    </div>
    <div id="second-evolution-step" class="d-f jc-sa ai-c">
        <div class="w-33 d-f jc-c" id="evolution2"></div>
        <img src="img/arrow-evolution.png">
        <div class="w-33 d-f jc-c" id="evolution3"></div>
    </div>`;
    await getEvolutionData(i);
}


async function getEvolutionData(i) {
    let url = pokemonSpecies[i]['evolution_chain']['url'];
    let response = await fetch(url);
    let evolution = await response.json();
    let data = evolution['chain']['evolves_to'];
    renderPokemonEvolutionSteps(evolution, data);
}


async function renderPokemonEvolutionSteps(evolution, data) {
    if (data.length >= 1) {
        let base = evolution['chain']['species']['name'];
        await renderPokemonEvolutionImg(base, 0);
        for (let f = 0; f < data.length; f++) {
            let first = data[f]['species']['name'];
            await renderPokemonEvolutionImg(first, 1);
            let second = data[f]['evolves_to'];
            if (second.length >= 1) {
                await renderPokemonEvolutionImg(first, 2);
                for (let s = 0; s < second.length; s++) {
                    let secondName = second[s]['species']['name']
                    await renderPokemonEvolutionImg(secondName, 3);
                }
            }
            else {
                document.getElementById('second-evolution-step').classList.add('d-none');
            }
        }
    } else {
        document.getElementById('first-evolution-step').classList.add('d-none');
        document.getElementById('second-evolution-step').classList.add('d-none');
        document.getElementById('details-content').innerHTML += /*html*/`
        <span>This Pokemon has no evolutions.</span>`;
    }
}


async function renderPokemonEvolutionImg(name, x) {
    for (let e = 0; e < pokemonNames.length; e++) {
        if (pokemonNames[e]['name'] === name) {
            let url = pokemonNames[e]['url'];
            let response = await fetch(url);
            let data = await response.json();
            if (data['sprites']['other']['dream_world']['front_default'] == null) {
                document.getElementById(`evolution${x}`).innerHTML += /*html*/`
                    <img class="evol-img" src="${data['sprites']['other']['home']['front_default']}">`;
            } else {
                document.getElementById(`evolution${x}`).innerHTML += /*html*/`
                    <img class="evol-img" src="${data['sprites']['other']['dream_world']['front_default']}">`;
            }
            return;
        }
    }
}


function underConstruction() {
    alert('under construction');
}