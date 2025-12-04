let chosenGen = 0;
async function randomPkmn() {
    let gen = chosenGen
    if (!gen || gen < 1 || gen > 9) { gen = Math.floor(Math.random() * 9) + 1; }
    const response = await fetch("https://tyradex.vercel.app/api/v1/gen/" + gen);
    const pkmnList = await response.json();

    const randomIndex = Math.floor(Math.random() * pkmnList.length);
    return pkmnList[randomIndex].pokedex_id;
}

// API pour obtenir les détails du Pokémon
async function fetchPkmnData(pkmnId) {
    const pkmnFetch = await fetch("https://tyradex.vercel.app/api/v1/pokemon/" + pkmnId);
    const response = await pkmnFetch.json();
    return response
}

let currentStats = {
    hp: 0,
    atk: 0,
    def: 0,
    spe_atk : 0,
    spe_def : 0,
    vit: 0
};
let lockedStats = {
    hp: {
        value: 0,
        pkmn: ""
    },
    atk: {
        value: 0,
        pkmn: ""
    },
    def: {
        value: 0,
        pkmn: ""
    },
    spe_atk : {
        value: 0,
        pkmn: ""
    },
    spe_def : {
        value: 0,
        pkmn: ""
    },
    vit: {
        value: 0,
        pkmn: ""
    }
};
let pkmnStats = {}
let statTotal = 0;
let choiceMade = true;

// élements HTMLs
const totalElem = document.getElementById("total-stats");
const imageElem = document.getElementById("pkmn-image");
const nameElem = document.getElementById("pkmn-name");
const statButtonList = {
    hp: {
        enabled : true,
        func : null,
        element : document.getElementById("stat-hp")
    },
    atk: {
        enabled : true,
        func : null,
        element : document.getElementById("stat-atk")
    },
    def: {
        enabled : true,
        func : null,
        element : document.getElementById("stat-def")
    },
    spe_atk : {
        enabled : true,
        func : null,
        element : document.getElementById("stat-spe_atk")
    },
    spe_def : {
        enabled : true,
        func : null,
        element : document.getElementById("stat-spe_def")
    },
    vit: {
        enabled : true,
        func : null,
        element : document.getElementById("stat-vit")
    }
};
const statShowList = {
    hp: document.getElementById("value-hp"),
    atk: document.getElementById("value-atk"),
    def: document.getElementById("value-def"),
    spe_atk : document.getElementById("value-spe_atk"),
    spe_def : document.getElementById("value-spe_def"),
    vit: document.getElementById("value-vit")
}
const statEndList = {
    hp: document.getElementById("end-stat-hp"),
    atk: document.getElementById("end-stat-atk"),
    def: document.getElementById("end-stat-def"),
    spe_atk : document.getElementById("end-stat-spe_atk"),
    spe_def : document.getElementById("end-stat-spe_def"),
    vit: document.getElementById("end-stat-vit")
};
const statEndTotal = document.getElementById("end-total-stats");

const refreshBtn = document.getElementById("refresh-btn");
const finishBtn = document.getElementById("finish-btn");
const restartBtn = document.getElementById("restart-btn");

// afficher les stats des poké un fois le choix effectué
function showStats(show = true) {
    if (show) {
        for (key in statShowList) {
            statShowList[key].innerText = currentStats[key]
        }
    } else {
        for (key in statShowList) {
            statShowList[key].innerText = ""
        }
    }
}

// combien de choix ont été faits
let choseIndex = 0

function chose(stat) {
    choiceMade = true;
    choseIndex++;
    showStats();

    statButtonList[stat].enabled = false;
    lockedStats[stat].pkmn = nameElem.innerText

    lockedStats[stat].value = currentStats[stat];
    statTotal += currentStats[stat];
    totalElem.innerText = `Total des stats : ${statTotal}`;

    if (choseIndex === 6) {
        refreshBtn.style.display = "none";
        finishBtn.style.display = "block";
    } else {
        finishBtn.style.display = "none";
        refreshBtn.style.display = "block";
    }

}

async function showPkmn(pkmnId) {
    const pkmnData = await fetchPkmnData(pkmnId);

    // stats
    if (!pkmnData.stats || pkmnData.stats.length < 1) {console.warn("Aucunes données pour "+pkmnData.name.fr); return;}
    currentStats = pkmnData.stats
    pkmnStats[pkmnData.name.fr] = pkmnData.stats

    for (const key in statButtonList){
        const currentButton = statButtonList[key]
        if (currentButton.enabled) {
            currentButton.func = (e) => {
                const btn = e.target;
                if (!choiceMade && btn && btn.dataset.locked == "0"){
                    chose(btn.dataset.stat);
                    btn.dataset.locked = '1';
                }
            };
        } else { currentButton.func = null }
    }

    // infos
    const img = pkmnData.sprites.regular;
    const name = pkmnData.name.fr;

    imageElem.src = img;
    nameElem.innerText = name;
}

refreshBtn.onclick = () => {
    if (choiceMade) {
        refreshBtn.style.display = "none"
        choiceMade = false;
        showStats(false);
        randomPkmn().then(name => {
            showPkmn(name);
        });
    }
};

finishBtn.onclick = async () => {
    for (const key in statEndList) {
        statEndList[key].querySelector(".statAmount").innerText = lockedStats[key].value;
        statEndList[key].querySelector(".pkmn").innerText = lockedStats[key].pkmn;
    }
    statEndTotal.innerText = `Total des stats : ${statTotal}`

    document.getElementById("game").style.display = "none";
    document.getElementById("end").style.display = "block";
}

restartBtn.onclick = () => {
    // reset tout
    for (const key in statButtonList){
        const currentButton = statButtonList[key]
        currentButton.enabled = true
        currentButton.func = null
        currentButton.element.dataset.locked = '0'
    }
    pkmnStats = {}
    currentStats = {
        hp: 0,
        atk: 0,
        def: 0,
        spe_atk: 0,
        spe_def: 0,
        vit: 0
    };

    statTotal = 0;
    choiceMade = true;
    choseIndex = 0;

    lockedStats = {
        hp: {
            value: 0,
            pkmn: ""
        },
        atk: {
            value: 0,
            pkmn: ""
        },
        def: {
            value: 0,
            pkmn: ""
        },
        spe_atk: {
            value: 0,
            pkmn: ""
        },
        spe_def: {
            value: 0,
            pkmn: ""
        },
        vit: {
            value: 0,
            pkmn: ""
        }
    };

    finishBtn.style.display = "none";
    refreshBtn.style.display = "block";

    imageElem.src = "";
    nameElem.innerText = "";

    document.getElementById("game").style.display = "none";
    document.getElementById("end").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

// menu
document.getElementById("startGame").onclick = () => {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";

    chosenGen = document.getElementById("genSelect").value;

    choiceMade = false;
    showStats(false);
    randomPkmn().then(name => {
        showPkmn(name);
    });
}

for (const key in currentStats){
    statButtonList[key].element.onclick = (e) => {
        const func = statButtonList[key].func;
        if (func != null) {func(e);}
    }
};