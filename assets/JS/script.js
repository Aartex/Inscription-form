for (let i = 16; i <= 99; i++) {
    document.getElementById('age').innerHTML += '<option value="' + i + '">' + i + ' ans</option>';
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const addParticipantBtn = document.querySelector(".participant");
    const containerParent = document.querySelector(".formulaire");
    const panierInfos = document.querySelector(".section-panier .form-group");
    const prixSemiMarathon = 90;
    const prixMarathonClassique = 120;

    let participantCount = 1;

});
