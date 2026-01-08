for (let i = 16; i <= 99; i++) {
    document.getElementById('age').innerHTML += '<option value="' + i + '">' + i + ' ans</option>';
}

const btnAjouter = document.querySelector(".equipe");
const formContainer = document.querySelector(".container");
const buttonGroup = document.querySelector(".button-form");

btnAjouter.addEventListener("click", () => {

    // 1. Changement du texte du bouton au premier clic
    if (btnAjouter.textContent.includes("équipe")) {
        btnAjouter.textContent = "Ajouter un participant";
    }

    //On cible le bloc complet d'un participant
    const blocACloner = document.querySelector(".participant-block");

    if (!blocACloner) return;

    // On clone le bloc
    const clone = blocACloner.cloneNode(true);
    const uniqueId = Date.now();

    // Nettoyage et sécurisation du clone
    const inputs = clone.querySelectorAll("input, select");

    inputs.forEach(input => {
        // IMPORTANT : On change ou supprime l'ID pour éviter les conflits
        if (input.id) {
            input.id = input.id + "_" + uniqueId;
        }

        if (input.type === "radio") {
            // On désélectionne dans le clone
            input.checked = false;
            // On donne un nom unique au groupe pour ce participant
            input.name = "epreuve_" + uniqueId;
        } else if (input.tagName === "SELECT") {
            input.selectedIndex = 0;
        } else {
            input.value = "";
        }
    });

    // Correction des labels (pour qu'ils pointent vers les nouveaux IDs)
    const labels = clone.querySelectorAll("label");
    labels.forEach(label => {
        const forAttribute = label.getAttribute("for");
        if (forAttribute) {
            label.setAttribute("for", forAttribute + "_" + uniqueId);
        }
    });

    // Insertion
    formContainer.insertBefore(clone, buttonGroup);
    mettreAJourPanier();
});

function mettreAJourPanier() {
    // 1. Compter tous les blocs de participants présents
    const nombreParticipants = document.querySelectorAll(".participant-block").length;

    // On force le script à regarder UNIQUEMENT le choix du premier participant
    const premierBloc = document.querySelector(".participant-block");
    const choix = premierBloc.querySelector('input[name="epreuve"]:checked');
    
    let prixUnitaire = 0;
    if (choix) {
        const valeur = choix.value;
        prixUnitaire = (valeur === "semi") ? 90 : 120;
    }

    // 3. Calcul total
    const totalPrix = nombreParticipants * prixUnitaire;

    // 4. Mise à jour de l'affichage
    document.querySelector("#participants").textContent = `Nombre de participants : ${nombreParticipants}`;
    document.querySelector("#montant").textContent = `Montant total : ${totalPrix}€`;
}

// On s'assure que le calcul se met à jour quand on change d'épreuve
// OU quand on ajoute un participant
document.addEventListener("change", (e) => {
    if (e.target.name === "epreuve") {
        mettreAJourPanier();
    }
});

// Appeler le calcul initial au chargement
mettreAJourPanier();

// --- FONCTION DE VALIDATION (Active/Désactive le bouton d'ajout) ---

// function checkFormValidity() {
//     const isValid = form.checkValidity();
//     btnAdd.disabled = !isValid;
//     btnAdd.style.opacity = isValid ? "1" : "0.5";
// }

// form.addEventListener('input', checkFormValidity);

// // 3. APPARITION DU BOUTON SUPPRIMER
// // On cible le bouton dans le nouveau bloc et on l'affiche
// const deleteBtn = newItem.querySelector('.supprime');
// deleteBtn.style.display = 'block';

// // 4. On ajoute le nouveau bloc à la liste
// participantsList.appendChild(newItem);

// // On désactive le bouton "Ajouter" car le nouveau participant n'est pas encore rempli
// checkFormValidity();

// // --- SUPPRIMER UN PARTICIPANT ---
// participantsList.addEventListener('click', (e) => {
//     if (e.target.classList.contains('supprime')) {
//         // Supprime le bloc parent
//         e.target.closest('.participant-item').remove();

//         // Après suppression, on vérifie si le bouton "Ajouter" doit être réactivé
//         checkFormValidity();
//     }
// });