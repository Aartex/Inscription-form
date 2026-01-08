document.addEventListener("DOMContentLoaded", () => {
    const btnAjouter = document.querySelector(".equipe");
    const btnSup = document.querySelector(".supprime");
    const formContainer = document.querySelector(".container");
    const buttonGroup = document.querySelector(".button-form");

for (let i = 16; i <= 99; i++) {
    document.getElementById('age').innerHTML += '<option value="' + i + '">' + i + ' ans</option>';
}

    // 1. Fonction de mise à jour du panier
    function mettreAJourPanier() {
        // On compte tous les blocs de participants (nom, prénom, etc.)
        const nombreParticipants = document.querySelectorAll(".participant-block").length;

        // On cherche le choix de l'épreuve (qui n'existe qu'une seule fois dans le HTML)
        const choix = document.querySelector('input[name="epreuve"]:checked');
        
        let prixUnitaire = 0;
        if (choix) {
            prixUnitaire = (choix.value === "semi") ? 90 : 120;
        }

        // Calcul : Prix de l'épreuve X nombre de personnes
        const totalPrix = nombreParticipants * prixUnitaire;

        // Mise à jour de l'affichage
        document.querySelector("#participants").textContent = `Nombre de participants : ${nombreParticipants}`;
        document.querySelector("#montant").textContent = `Montant total : ${totalPrix}€`;
    }

    // 2. Ajouter un participant
    btnAjouter.addEventListener("click", () => {
        // Changement du texte du bouton
        if (btnAjouter.textContent.includes("équipe")) {
            btnAjouter.textContent = "Ajouter un participant";
        }

        const blocACloner = document.querySelector(".participant-block");
        const clone = blocACloner.cloneNode(true);
        const uniqueId = Date.now();

        // Nettoyage du clone
        clone.querySelectorAll("input, select").forEach(input => {
            if (input.id) input.id += "_" + uniqueId;
            input.value = "";
        });

        // Insertion avant les boutons
        formContainer.insertBefore(clone, buttonGroup);
        mettreAJourPanier();
    });

// 3. Supprimer le DERNIER participant
btnSup.addEventListener("click", () => {
    const blocs = document.querySelectorAll(".participant-block");
    
    // On ne supprime que s'il reste plus d'un bloc
    if (blocs.length > 1) {
        // Supprime le dernier bloc
        blocs[blocs.length - 1].remove();

    
        // Si après suppression il ne reste qu'un seul bloc, on remet le texte initial
        const blocsRestants = document.querySelectorAll(".participant-block");
        if (blocsRestants.length === 1) {
            btnAjouter.textContent = "Inscription en équipe ?";
        }
        // -----------------

        mettreAJourPanier();
    } else {
        alert("Il doit y avoir au moins un participant.");
    }
});

    // 4. Écouter le changement d'épreuve (radio)
    document.addEventListener("change", (e) => {
        if (e.target.name === "epreuve") {
            mettreAJourPanier();
        }
    });

    // Initialisation
    mettreAJourPanier();
});