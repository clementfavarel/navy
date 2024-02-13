var controleur;
// var canalsocketio;

window.addEventListener("load", init, false);

function init(e) {
    controleur = new Controleur();
    // canalsocketio = new CanalSocketio(io(), controleur, "canalsocketio");
    var login = new Login(
        document.getElementById("login"),
        controleur,
        "login"
    );

    login.affiche();
}
