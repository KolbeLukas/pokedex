/* TOP SECTION */

function openDetailsOverlay(i) {
    document.getElementById('details-overlay').classList.remove('n-vis');
    document.getElementById('pseudo-overlay').classList.remove('d-none');
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
    document.getElementById('details-overlay').classList.add('n-vis');
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


/* ABOUT */

function renderCoreInfos(i) {
    document.getElementById('about').classList.add('active');
    document.getElementById('evolution').classList.remove('active');
    document.getElementById('base-stats').classList.remove('active');
    document.getElementById('details-content').innerHTML = renderCoreInfosContent(i);
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
    document.getElementById('details-content').innerHTML = renderBaseStatsContent(i);
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
        setStatColor(percent, j);
    }
}

function setStatColor(percent, j) {
    if (percent > 50) {
        document.getElementById(`stat-bar${j}`).style.backgroundColor = "rgb(90 175 105)";
    } else {
        document.getElementById(`stat-bar${j}`).style.backgroundColor = "rgb(255 56 11)";
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
    setTotalStatColor(percent);
}

function setTotalStatColor(percent) {
    if (percent > 50) {
        document.getElementById('total-bar').style.backgroundColor = "rgb(90 175 105)";
    } else {
        document.getElementById('total-bar').style.backgroundColor = "rgb(255 56 11)";
    }
}


/* EVOLUTION */

async function renderEvolutionList(i) {
    document.getElementById('about').classList.remove('active');
    document.getElementById('base-stats').classList.remove('active');
    document.getElementById('evolution').classList.add('active');
    document.getElementById('details-content').innerHTML = renderEvolutionListContent();
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
        await getFirstEvolution(data);
    } else {
        noEvolutions();
    }
}

async function getFirstEvolution(data) {
    for (let f = 0; f < data.length; f++) {
        let first = data[f]['species']['name'];
        await renderPokemonEvolutionImg(first, 1);
        await getSecondEvolutions(data, first, f);
    }
}

async function getSecondEvolutions(data, first, f) {
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

function noEvolutions() {
    document.getElementById('first-evolution-step').classList.add('d-none');
    document.getElementById('second-evolution-step').classList.add('d-none');
    document.getElementById('details-content').innerHTML += /*html*/`
        <span>This Pokemon has no evolutions.</span>`;
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