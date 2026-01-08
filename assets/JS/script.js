document.addEventListener("DOMContentLoaded", function () {
    // --- 1. SÉLECTIONS DES ÉLÉMENTS (const car les références aux boutons ne changent pas) ---
    const btnAjouter = document.querySelector(".equipe");
    const btnSupGlobal = document.querySelector(".supprime");
    const btnValiderEnregistrement = document.querySelector(".valider");
    const formContainer = document.querySelector(".container");
    const buttonGroup = document.querySelector(".button-form");
    const listeParticipantsUI = document.querySelector("#liste-participants");

    // --- 2. INITIALISATION DES ÂGES ---
    const ageInitial = document.getElementById('age');
    if (ageInitial) {
        // let car "i" change à chaque itération
        for (let i = 16; i <= 99; i++) {
            ageInitial.innerHTML += '<option value="' + i + '">' + i + ' ans</option>';
        }
    }

    // --- 3. FONCTION DE MISE À JOUR DU PANIER ---
    function mettreAJourPanier() {
        const blocs = document.querySelectorAll(".participant-block");
        const choix = document.querySelector('input[name="epreuve"]:checked');
        
        // let car la valeur va être modifiée selon la condition
        let prixUnitaire = 0;
        if (choix) {
            prixUnitaire = (choix.value === "semi") ? 90 : 120;
        }

        if (listeParticipantsUI) {
            listeParticipantsUI.innerHTML = ""; 
            
            blocs.forEach(function (bloc, index) {
                const inputNom = bloc.querySelector('input[name="nom"]');
                const inputPrenom = bloc.querySelector('input[name="prenom"]');
                
                const nom = inputNom ? inputNom.value.toUpperCase() : "";
                const prenom = inputPrenom ? inputPrenom.value : "";
                const affichageNom = (nom || prenom) ? prenom + " " + nom : "Participant " + (index + 1);

                const li = document.createElement("li");
                li.style.display = "flex";
                li.style.justifyContent = "space-between";
                li.style.marginBottom = "5px";

                li.innerHTML = 
                    '<span>' + affichageNom + '</span>' +
                    '<button class="delete-btn" data-index="' + index + '" title="Supprimer ce participant" style="color:red; cursor:pointer; border:none; background:none;">✖</button>';
                
                listeParticipantsUI.appendChild(li);
            });
        }

        const totalPrix = blocs.length * prixUnitaire;
        document.querySelector("#participants").textContent = "Nombre de participants : " + blocs.length;
        document.querySelector("#montant").textContent = "Montant total : " + totalPrix + "€";

        // Mise à jour du texte du bouton
        if (blocs.length > 1) {
            btnAjouter.textContent = "Ajouter un participant";
        } else {
            btnAjouter.textContent = "Inscription en équipe";
        }
    }

    // --- 4. FONCTION DE VALIDATION ---
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
                const msg = "Informations incomplètes pour le participant " + (index + 1);
                if (messagesErreur.indexOf(msg) === -1) {
                    messagesErreur.push(msg);
                }
            }
        });

        if (!estValide) {
            alert("Erreur de validation :\n" + messagesErreur.join("\n"));
        }
        return estValide;
    }

    // --- 5. ÉCOUTEURS D'ÉVÉNEMENTS ---

    btnValiderEnregistrement.addEventListener("click", function () {
        if (validerLeFormulaire()) {
            alert("Félicitations ! Votre inscription est complète.");
        }
    });

    btnAjouter.addEventListener("click", function () {
        const blocACloner = document.querySelector(".participant-block");
        const clone = blocACloner.cloneNode(true);
        const uniqueId = Date.now();

        clone.querySelectorAll("input, select").forEach(function (input) {
            if (input.id) {
                input.id = input.id + "_" + uniqueId;
            }
            input.value = ""; 
        });

        formContainer.insertBefore(clone, buttonGroup);
        mettreAJourPanier();
    });

    btnSupGlobal.addEventListener("click", function () {
        const blocs = document.querySelectorAll(".participant-block");
        if (blocs.length > 1) {
            blocs[blocs.length - 1].remove();
            mettreAJourPanier();
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
                }
            }
        });
    }

    formContainer.addEventListener("input", function (e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
            mettreAJourPanier();
        }
    });

    document.addEventListener("change", function (e) {
        if (e.target.name === "epreuve") {
            mettreAJourPanier();
        }
    });

    // Initialisation
    mettreAJourPanier();
});