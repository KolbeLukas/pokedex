function renderOnePokemonBoxStructure(i, onePokemon) {
    return /*html*/`
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
        </div>`
}


function renderCoreInfosContent(i) {
    return /*html*/`
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
}


function renderBaseStatsContent(i) {
    return /*html*/`
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
}


function renderEvolutionListContent() {
    return /*html*/`
        <h4>Evolution Chain</h4>
        <div id="first-evolution-step" class="d-f jc-sa ai-c p-b">
            <div class="w-33 d-f jc-c" id="evolution0"></div>
            <img src="img/arrow-evolution.png">
            <div class="w-33 d-f jc-c fd-c" id="evolution1"></div>
        </div>
        <div id="second-evolution-step" class="d-f jc-sa ai-c">
            <div class="w-33 d-f jc-c" id="evolution2"></div>
            <img src="img/arrow-evolution.png">
            <div class="w-33 d-f jc-c fd-c" id="evolution3"></div>
        </div>`;
}