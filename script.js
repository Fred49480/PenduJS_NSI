const mots = ["ordinateur", "javascript", "algorithme", "pendu", "programmation"];
const maxErreurs = 6;

let motSecret = "";
let motAffiche = [];
let lettresUtilisees = [];
let erreurs = 0;
let jeuTermine = false;

const canvas = document.getElementById("penduCanvas");
const ctx = canvas.getContext("2d");

const motAfficheElem = document.getElementById("motAffiche");
const lettresUtiliseesElem = document.getElementById("lettresUtilisees");
const messageElem = document.getElementById("message");
const restartBtn = document.getElementById("restart");

/* --- Fonctions utilitaires --- */

function normaliser(lettre) {
    return lettre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function choisirMot() {
    const mot = mots[Math.floor(Math.random() * mots.length)];
    return normaliser(mot.toLowerCase());
}

/* --- Initialisation --- */

function initJeu() {
    motSecret = choisirMot();
    motAffiche = Array(motSecret.length).fill("_");
    lettresUtilisees = [];
    erreurs = 0;
    jeuTermine = false;
    messageElem.textContent = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dessinerPendu();
    afficher();
}

function afficher() {
    motAfficheElem.textContent = motAffiche.join(" ");
    lettresUtiliseesElem.textContent = lettresUtilisees.join(", ");
}

/* --- Dessin du pendu --- */

function dessinerPendu() {
    ctx.lineWidth = 2;

    if (erreurs > 0) { // potence
        ctx.beginPath();
        ctx.moveTo(20, 230);
        ctx.lineTo(180, 230);
        ctx.moveTo(50, 230);
        ctx.lineTo(50, 20);
        ctx.lineTo(120, 20);
        ctx.lineTo(120, 40);
        ctx.stroke();
    }
    if (erreurs > 1) { // tête
        ctx.beginPath();
        ctx.arc(120, 60, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (erreurs > 2) { // corps
        ctx.beginPath();
        ctx.moveTo(120, 80);
        ctx.lineTo(120, 140);
        ctx.stroke();
    }
    if (erreurs > 3) { // bras gauche
        ctx.beginPath();
        ctx.moveTo(120, 100);
        ctx.lineTo(90, 120);
        ctx.stroke();
    }
    if (erreurs > 4) { // bras droit
        ctx.beginPath();
        ctx.moveTo(120, 100);
        ctx.lineTo(150, 120);
        ctx.stroke();
    }
    if (erreurs > 5) { // jambes
        ctx.beginPath();
        ctx.moveTo(120, 140);
        ctx.lineTo(90, 180);
        ctx.moveTo(120, 140);
        ctx.lineTo(150, 180);
        ctx.stroke();
    }
}

/* --- Gestion des lettres --- */

function proposerLettre(lettre) {
    if (jeuTermine || lettresUtilisees.includes(lettre)) return;

    lettresUtilisees.push(lettre);

    if (motSecret.includes(lettre)) {
        for (let i = 0; i < motSecret.length; i++) {
            if (motSecret[i] === lettre) {
                motAffiche[i] = lettre;
            }
        }
    } else {
        erreurs++;
        dessinerPendu();
    }

    verifierFin();
    afficher();
}

function verifierFin() {
    if (!motAffiche.includes("_")) {
        messageElem.textContent = "🎉 Bravo, vous avez gagné !";
        jeuTermine = true;
    } else if (erreurs >= maxErreurs) {
        messageElem.textContent = "💀 Perdu ! Le mot était : " + motSecret;
        jeuTermine = true;
    }
}

/* --- Événements --- */

document.addEventListener("keydown", (event) => {
    const lettre = normaliser(event.key.toLowerCase());

    if (/^[a-z]$/.test(lettre)) {
        proposerLettre(lettre);
    }
});

restartBtn.addEventListener("click", initJeu);

/* --- Lancement --- */
initJeu();
