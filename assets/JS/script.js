document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. SÉLECTION DES ÉLÉMENTS DU DOM
    // ==========================================
    // On utilise 'const' car les références à ces éléments ne changeront jamais.
    const btnAjouter = document.querySelector(".equipe");           // Bouton pour ajouter un bloc
    const btnSupGlobal = document.querySelector(".supprime");       // Bouton pour supprimer le dernier
    const btnValiderEnregistrement = document.querySelector(".valider"); // Bouton de validation finale
    const formContainer = document.querySelector(".container");     // Parent qui contient les blocs
    const buttonGroup = document.querySelector(".button-form");     // Groupe de boutons (point d'insertion)
    const listeParticipantsUI = document.querySelector("#liste-participants"); // Liste <ul> dans le panier

    // ==========================================
    // 2. INITIALISATION DYNAMIQUE
    // ==========================================
    const ageInitial = document.getElementById('age');
    if (ageInitial) {
        // Boucle pour remplir le menu déroulant des âges de 16 à 99 ans
        for (let i = 16; i <= 99; i++) {
            ageInitial.innerHTML += '<option value="' + i + '">' + i + ' ans</option>';
        }
    }

    // ==========================================
    // 3. LOGIQUE DU PANIER (MISE À JOUR)
    // ==========================================
    function mettreAJourPanier() {
        // On récupère tous les blocs de participants actuellement présents
        const blocs = document.querySelectorAll(".participant-block");
        
        // On vérifie quelle épreuve est cochée pour déterminer le prix
        const choix = document.querySelector('input[name="epreuve"]:checked');
        let prixUnitaire = 0;
        if (choix) {
            prixUnitaire = (choix.value === "semi") ? 90 : 120;
        }

        // --- Mise à jour de la liste visuelle dans le panier ---
        if (listeParticipantsUI) {
            listeParticipantsUI.innerHTML = ""; // On vide la liste avant de la reconstruire
            
            blocs.forEach(function (bloc, index) {
                // Extraction du nom et prénom dans le bloc actuel
                const inputNom = bloc.querySelector('input[name="nom"]');
                const inputPrenom = bloc.querySelector('input[name="prenom"]');
                
                const nom = inputNom ? inputNom.value.toUpperCase() : "";
                const prenom = inputPrenom ? inputPrenom.value : "";
                
                // Si les champs sont vides, on affiche un nom par défaut (ex: Participant 1)
                const affichageNom = (nom || prenom) ? prenom + " " + nom : "Participant " + (index + 1);

                // Création de l'élément de liste (li)
                const li = document.createElement("li");
                li.style.display = "flex";
                li.style.justifyContent = "space-between";
                li.style.marginBottom = "5px";

                // Le bouton 'delete-btn' reçoit un 'data-index' pour savoir quel bloc il doit supprimer
                li.innerHTML = 
                    '<span>' + affichageNom + '</span>' +
                    '<button class="delete-btn" data-index="' + index + '" style="color:red; cursor:pointer; border:none; background:none;">✖</button>';
                
                listeParticipantsUI.appendChild(li);
            });
        }

        // --- Calcul et affichage des totaux ---
        const totalPrix = blocs.length * prixUnitaire;
        document.querySelector("#participants").textContent = "Nombre de participants : " + blocs.length;
        document.querySelector("#montant").textContent = "Montant total : " + totalPrix + "€";

        // Ajustement dynamique du texte du bouton d'ajout
        if (blocs.length > 1) {
            btnAjouter.textContent = "Ajouter un participant";
        } else {
            btnAjouter.textContent = "Inscription en équipe";
        }
    }

    // ==========================================
    // 4. SYSTÈME DE VALIDATION
    // ==========================================
    function validerLeFormulaire() {
        let estValide = true;
        const messagesErreur = [];

        // Vérification de l'épreuve (obligatoire)
        const epreuveCochee = document.querySelector('input[name="epreuve"]:checked');
        if (!epreuveCochee) {
            estValide = false;
            messagesErreur.push("Veuillez choisir une épreuve.");
        }

        // Vérification de chaque participant
        const blocs = document.querySelectorAll(".participant-block");
        blocs.forEach(function (bloc, index) {
            const nom = bloc.querySelector('input[name="nom"]').value.trim();
            const prenom = bloc.querySelector('input[name="prenom"]').value.trim();
            const email = bloc.querySelector('input[name="email"]').value.trim();
            const age = bloc.querySelector('select[name="age"]').value;

            // Si un des champs obligatoires est vide
            if (!nom || !prenom || !age || !email) {
                estValide = false;
                const msg = "Informations incomplètes pour le participant " + (index + 1);
                // Évite de doubler le message d'erreur si plusieurs champs manquent
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

    // ==========================================
    // 5. GESTIONNAIRES D'ÉVÉNEMENTS (LISTENERS)
    // ==========================================

    // Action : Valider tout le formulaire
    btnValiderEnregistrement.addEventListener("click", function () {
        if (validerLeFormulaire()) {
            alert("Félicitations ! Votre inscription est complète.");
        }
    });

    // Action : Ajouter un nouveau participant (clonage)
    btnAjouter.addEventListener("click", function () {
        const blocACloner = document.querySelector(".participant-block");
        const clone = blocACloner.cloneNode(true); // 'true' pour copier aussi les enfants (labels, inputs)
        const uniqueId = Date.now(); // Génère un nombre unique basé sur le temps

        // On réinitialise les champs du clone pour qu'ils soient vides
        clone.querySelectorAll("input, select").forEach(function (input) {
            if (input.id) {
                input.id = input.id + "_" + uniqueId; // On évite les IDs en double
            }
            input.value = ""; 
        });

        // On insère le nouveau bloc juste avant le groupe de boutons
        formContainer.insertBefore(clone, buttonGroup);
        mettreAJourPanier();
    });

    // Action : Supprimer le dernier participant via le bouton sous le formulaire
    btnSupGlobal.addEventListener("click", function () {
        const blocs = document.querySelectorAll(".participant-block");
        if (blocs.length > 1) {
            blocs[blocs.length - 1].remove();
            mettreAJourPanier();
        } else {
            alert("Il doit y avoir au moins un participant.");
        }
    });

    // Action : Supprimer un participant spécifique via la croix dans le panier
    // On utilise la "délégation d'événement" sur le parent (listeParticipantsUI)
    if (listeParticipantsUI) {
        listeParticipantsUI.addEventListener("click", function (e) {
            if (e.target.classList.contains("delete-btn")) {
                const index = e.target.getAttribute("data-index");
                const blocs = document.querySelectorAll(".participant-block");
                
                if (blocs.length > 1) {
                    blocs[index].remove(); // Supprime le bloc correspondant à l'index cliqué
                    mettreAJourPanier();
                } else {
                    alert("Impossible de supprimer le premier participant.");
                }
            }
        });
    }

    // Action : Mise à jour en temps réel lors de la saisie (Nom/Prénom)
    formContainer.addEventListener("input", function (e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
            mettreAJourPanier();
        }
    });

    // Action : Mise à jour lors du changement d'épreuve (Radio boutons)
    document.addEventListener("change", function (e) {
        if (e.target.name === "epreuve") {
            mettreAJourPanier();
        }
    });

    // --- Initialisation au chargement de la page ---
    mettreAJourPanier();
});