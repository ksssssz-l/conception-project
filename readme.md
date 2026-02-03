# 🤰 Projet : Le Parcours des Parents (Accompagnement Co-parent)

[cite_start]Ce projet est une plateforme web interactive conçue pour accompagner le co-parent durant le parcours de grossesse, de l'inscription à la maternité jusqu'à la sortie de l'hôpital[cite: 24, 25]. Il propose une expérience fluide divisée entre information pédagogique et gestion dynamique de rendez-vous.

## 🛠️ Stack Technique
* **Frontend** : HTML5, CSS3 (Flexbox/Grid), JavaScript ES6+.
* **Design** : Respect de la charte graphique "Zalando Sans" et des codes couleurs spécifiques aux services hospitaliers.
* **Persistance des données** : Système de stockage via `localStorage` (JSON) permettant une synchronisation en temps réel entre la prise de rendez-vous et le tableau de bord sans serveur backend.

## 🚀 Parcours Utilisateur (User Journey)

### 1. Phase d'Information (Accueil)
* **Consultation** : L'utilisateur accède aux grandes étapes du parcours via une interface à cartes horizontales.
* **Navigation** : Un sommaire latéral fixe permet d'approfondir des sujets comme le rôle du co-parent ou la préparation à la naissance.

### 2. Prise de Rendez-vous (Côté Parent)
* **Tunnel dynamique** : Sélection du service (Psychologue, Médecin, Gynécologue) déclenchant un affichage par étapes.
* **Spécificités Psy** : Le système adapte les créneaux selon le motif choisi (ex: 1h pour un couple, 45min pour une femme enceinte).
* **Confirmation** : Dès la validation, le rendez-vous est injecté dans le fichier JSON local.

### 3. Gestion Administrative (Tableau de Bord Praticien)
* **Visualisation** : Le praticien accède à une vue journalière de ses consultations.
* **Code Couleur** : Identification immédiate des profils : **Bleu** pour les couples, **Orange** pour les suivis de grossesse, et **Vert** pour les périodes de repos.
* **Logique métier** : Les zones de fermeture et les temps de pause déjeuner sont intégrés automatiquement à l'affichage.

## 📂 Structure du Projet
* `index.html` : Portail d'information avec mise en page à deux colonnes.
* `rdv.html` : Interface de réservation dynamique par étapes.
* `dashboard.html` : Interface d'administration pour les praticiens.
* `styles.css` : Design system unifié (Variables, Layouts, Animations).
* `script.js` : Moteur de réservation et gestion du stockage local.
* `dashboard.js` : Logique d'affichage et de filtrage des rendez-vous admin.

## ⚙️ Test de la synchronisation
1. Ouvrez `rdv.html` et effectuez une réservation avec **Madame Lemaire**.
2. Allez jusqu'au récapitulatif final.
3. Ouvrez `dashboard.html` : le rendez-vous apparaît dynamiquement avec le style visuel correspondant au motif sélectionné.