document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. SÉLECTION DES ÉLÉMENTS DU DOM
    // ==========================================
    const btnAjouter = document.querySelector(".equipe");
    const btnSupGlobal = document.querySelector(".supprime");
    const btnValiderEnregistrement = document.querySelector(".valider");
    const formContainer = document.querySelector(".container");
    const buttonGroup = document.querySelector(".button-form");
    const listeParticipantsUI = document.querySelector("#liste-participants");

    // ==========================================
    // 2. INITIALISATION DYNAMIQUE
    // ==========================================
    const ageInitial = document.getElementById('age');
    if (ageInitial) {
        for (let i = 16; i <= 99; i++) {
            ageInitial.innerHTML += '<option value="' + i + '">' + i + ' ans</option>';
        }
    }

    // ==========================================
    // 3. LOGIQUE DU BOUTON (GRISER/ACTIVER)
    // ==========================================
    function rafraichirEtatBoutonAjouter() {
        let tousRemplis = true;
        const blocs = document.querySelectorAll(".participant-block");

        // 1. On vérifie si une épreuve est cochée
        const epreuveCochee = document.querySelector('input[name="epreuve"]:checked');
        if (!epreuveCochee) {
            tousRemplis = false;
        }

        // 2. On vérifie si tous les champs de chaque participant sont remplis
        blocs.forEach(function (bloc) {
            const nom = bloc.querySelector('input[name="nom"]').value.trim();
            const prenom = bloc.querySelector('input[name="prenom"]').value.trim();
            const email = bloc.querySelector('input[name="email"]').value.trim();
            const age = bloc.querySelector('select[name="age"]').value;

            if (!nom || !prenom || !age || !email) {
                tousRemplis = false;
            }
        });

        // 3. On applique l'état au bouton
        btnAjouter.disabled = !tousRemplis;
    }

    // ==========================================
    // 4. LOGIQUE DU PANIER
    // ==========================================
    function mettreAJourPanier() {
        const blocs = document.querySelectorAll(".participant-block");
        const choix = document.querySelector('input[name="epreuve"]:checked');
        let prixUnitaire = 0;
        if (choix) {
            prixUnitaire = (choix.value === "semi") ? 90 : 120;
        }

        if (listeParticipantsUI) {
            listeParticipantsUI.innerHTML = "";
            blocs.forEach(function (bloc, index) {
                const nom = (bloc.querySelector('input[name="nom"]').value || "").toUpperCase();
                const prenom = bloc.querySelector('input[name="prenom"]').value || "";
                const affichageNom = (nom || prenom) ? prenom + " " + nom : "Participant " + (index + 1);

                let mentionCapitaine = ""; // Ajout de la mention capitaine
                if (blocs.length > 1 && index === 0) {
                    const styleCouleur = "color: #407ac9; font-style: italic; margin-left: 5px;";
                    mentionCapitaine = `<span style="${styleCouleur}">(Capitaine de l'équipe)</span>`;
                }
                const li = document.createElement("li");
                li.style.marginBottom = "8px";
                li.innerHTML = `<span>${affichageNom}${mentionCapitaine}</span>
                                <button class="delete-btn" data-index="${index}" style="color:red; cursor:pointer; border:none; background:none;">✖</button>`;
                listeParticipantsUI.appendChild(li);
            });
        }

        const totalPrix = blocs.length * prixUnitaire;
        document.querySelector("#participants").textContent = "Nombre de participants : " + blocs.length;
        document.querySelector("#montant").textContent = "Montant total : " + totalPrix + "€";

        btnAjouter.textContent = blocs.length > 1 ? "Ajouter un participant" : "Inscription en équipe";
    }

    // ==========================================
    // 5. SYSTÈME DE VALIDATION (POUR LE CLIC FINAL)
    // ==========================================
    function validerLeFormulaire() {
        let estValide = true;
        const messagesErreur = [];
        const epreuveCochee = document.querySelector('input[name="epreuve"]:checked');

        if (!epreuveCochee) {
            estValide = false;
            messagesErreur.push("Veuillez choisir une épreuve.");
        }

        const blocs = document.querySelectorAll(".participant-block");
        blocs.forEach(function (bloc, index) {
            const nom = bloc.querySelector('input[name="nom"]').value.trim();
            const prenom = bloc.querySelector('input[name="prenom"]').value.trim();
            const email = bloc.querySelector('input[name="email"]').value.trim();
            const age = bloc.querySelector('select[name="age"]').value;

            if (!nom || !prenom || !age || !email) {
                estValide = false;
                messagesErreur.push("Informations incomplètes pour le participant " + (index + 1));
            }
        });

        if (!estValide) {
            alert("Erreur de validation :\n" + messagesErreur.join("\n"));
        }
        return estValide;
    }

    // ==========================================
    // 6. GESTIONNAIRES D'ÉVÉNEMENTS
    // ==========================================

    btnValiderEnregistrement.addEventListener("click", function () {
        if (validerLeFormulaire()) {
            alert("Félicitations ! Votre inscription est complète.");
        }
    });

    btnAjouter.addEventListener("click", function () {
        const blocs = document.querySelectorAll(".participant-block");
        const blocACloner = blocs[0];
        const clone = blocACloner.cloneNode(true);
        const uniqueId = Date.now();

        clone.querySelectorAll("input, select").forEach(function (input) {
            if (input.id) input.id = input.id + "_" + uniqueId;
            input.value = "";
        });

        formContainer.insertBefore(clone, buttonGroup);
        mettreAJourPanier();
        rafraichirEtatBoutonAjouter(); // Indispensable : désactive le bouton car le nouveau bloc est vide
    });

    btnSupGlobal.addEventListener("click", function () {
        const blocs = document.querySelectorAll(".participant-block");
        if (blocs.length > 1) {
            blocs[blocs.length - 1].remove();
            mettreAJourPanier();
            rafraichirEtatBoutonAjouter();
        } else {
            alert("Il doit y avoir au moins un participant.");
        }
    });

    if (listeParticipantsUI) {
        listeParticipantsUI.addEventListener("click", function (e) {
            if (e.target.classList.contains("delete-btn")) {
                const index = e.target.getAttribute("data-index");
                const blocs = document.querySelectorAll(".participant-block");
                if (blocs.length > 1) {
                    blocs[index].remove();
                    mettreAJourPanier();
                } else {
                    alert("Impossible de supprimer le premier participant.");
                    rafraichirEtatBoutonAjouter();
                }
            }
        });
    }

    formContainer.addEventListener("input", function (e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
            mettreAJourPanier();
            rafraichirEtatBoutonAjouter();
        }
    });

    document.addEventListener("change", function (e) {
        if (e.target.name === "epreuve") {
            mettreAJourPanier();
            rafraichirEtatBoutonAjouter();
        }
    });

    // --- Initialisation ---
    mettreAJourPanier();
    rafraichirEtatBoutonAjouter();
});