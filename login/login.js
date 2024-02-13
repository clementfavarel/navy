class Login {
    constructor(support, controleur, nom) {
        this.support = support;
        this.controleur = controleur;
        this.nomDInstance = nom;
        this.verbose = false;
        this.listeDesMessagesEmis = ["demande_de_connexion"];
        this.listeDesMessagesRecus = [
            "vous_etes_connecte",
            "donne_liste_joueurs",
        ];
        this.nomJoueur = "";
        this.idJoueur = "";

        this.controleur.inscription(
            this,
            this.listeDesMessagesEmis,
            this.listeDesMessagesRecus
        );
    }

    affiche() {
        const loginForm = document.createElement("form");
        loginForm.innerHTML = `
            <label for="pseudo">Pseudo:</label>
            <input type="text" id="pseudo" name="pseudo">
            <button type="submit">Connect</button>
        `;
        loginForm.addEventListener("submit", this.handleLogin.bind(this));
        this.support.appendChild(loginForm);
    }

    handleLogin(event) {
        event.preventDefault();
        const pseudoInput = event.target.elements["pseudo"];
        const pseudo = pseudoInput.value.trim();

        if (pseudo !== "") {
            this.nomJoueur = pseudo;
            const message = {
                demande_de_connexion: pseudo,
            };
            console.log("Sending message:", message);
            this.controleur.envoie(this, message);
        }
    }

    afficheListeJoueurs(liste) {
        const playersTable = document.createElement("table");
        playersTable.innerHTML = `
            <thead>
                <tr>
                    <th>Pseudo</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                ${liste
                    .map(
                        (player) => `
                    <tr>
                        <td>${player.pseudo}</td>
                        <td>${player.frag}</td>
                    </tr>
                `
                    )
                    .join("")}
            </tbody>
        `;
        this.support.innerHTML = "";
        this.support.appendChild(playersTable);
    }

    traitementMessage(mesg) {
        if (mesg.hasOwnProperty("vous_etes_connecte")) {
            const { etat, pseudo, id } = mesg.vous_etes_connecte;
            if (etat === true) {
                this.nomJoueur = pseudo;
                this.idJoueur = id;
                console.log(`Logged in as ${pseudo} with ID ${id}`);
            } else {
                console.log("Connection failed.");
            }
        } else if (mesg.hasOwnProperty("donne_liste_joueurs")) {
            const listeJoueurs = mesg.donne_liste_joueurs;
            const players = Object.keys(listeJoueurs).map((key) => ({
                pseudo: listeJoueurs[key].pseudo,
                frag: listeJoueurs[key].frag,
            }));
            this.afficheListeJoueurs(players);
        }
    }
}
