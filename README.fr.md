# 🎣 ArchiDexFishing

*[Lire cette documentation en anglais](./README.md)*

> **Un projet fullstack interactif permettant aux viewers Twitch de pêcher, collectionner et suivre leurs Pokémon aquatiques en temps réel via un Pokédex personnel.**

ArchiDexFishing fonctionne en synergie avec le jeu de pêche **[Lurk Bait Twitch Fishing](https://blam.cam/)**, qui a été lourdement customisé pour l'occasion. Lorsqu'un viewer capture un Pokémon sur le stream, le jeu l'annonce dans le chat. L'écosystème intercepte ce message, l'enregistre, calcule les succès en temps réel, et le viewer peut immédiatement admirer sa prise, ses statistiques et son classement sur l'interface web dédiée !

---

## 📑 Table des matières
1. [Comment ça marche ?](#-comment-ça-marche-)
2. [Fonctionnalités du Front (Application Web)](#-fonctionnalités-du-front-application-web)
3. [Architecture du Projet](#-architecture-du-projet)
4. [Technologies Utilisées](#-technologies-utilisées)
5. [Installation & Démarrage](#-installation--démarrage)

---

## 🔄 Comment ça marche ?

Le flux de données se déroule en 4 étapes clés :

1. **Jeu de pêche tiers ([Lurk Bait Twitch Fishing](https://blam.cam/))** : Les viewers interagissent avec le jeu directement sur le stream. Le jeu a été **entièrement customisé** pour l'univers Pokémon : il permet exclusivement la capture de Pokémon de type Eau ou appartenant à un groupe d'œufs aquatique. Avec **230 Pokémon disponibles** (en version normale et *shiny*), le jeu intègre leurs vrais cris, leurs poids réels, ainsi qu'une valeur liée à leur rareté. Une fois le Pokémon attrapé, le jeu annonce la capture dans le chat Twitch.
2. **Bot Twitch** : Écoute le chat en permanence, détecte les messages de capture validés par le jeu et extrait les données du joueur et du Pokémon capturé. Il se charge également d'annoncer dans le chat les succès obtenus par un joueur après une capture.
3. **Backend** : Reçoit les données du bot et met à jour la base de données en ajoutant la capture au profil de l'utilisateur. Les succès sont calculés en temps réel lors de cette étape : si un joueur débloque un succès, le backend renvoie un message au bot pour qu'il l'affiche instantanément dans le chat Twitch. Ces données sont également rendues disponibles pour l'application web.
4. **Frontend** : Récupère les données du backend pour afficher l'évolution, la collection et les succès des joueurs en temps réel.

---

## 🏗 Architecture du Projet

Le dépôt monorepo est divisé en trois dossiers principaux :

* 📁 **/front** : L'interface utilisateur Web développée en Vue.js. Elle interroge le backend pour afficher le Pokédex interactif, les statistiques, les succès et les leaderboard.
* 📁 **/back** : Le serveur principal. Il gère la logique métier, la connexion à la base de données, le calcul des succès, et sert d'API centrale entre le bot et le frontend.
* 📁 **/bot** : Connecté à l'API Twitch, il lit le chat, filtre les annonces de Lurk Bait, envoie les données de capture au backend, et relaie les annonces de succès dans le chat.

---

## 💻 Technologies Utilisées

* **Frontend** : Vue.js, Nuxt.Js, JavaScript, SCSS
* **Backend** : Node.js, Express, MongoDB
* **Bot** : Node.js, Twitch API (ex: tmi.js / Twitch.js)
* **Jeu Tiers** : Lurk Bait Twitch Fishing (Customisé pour l'occasion)

---

## ✨ Fonctionnalités du Front (Application Web)

L'application web est le véritable tableau de bord pour les viewers, offrant une expérience riche et détaillée :

### 📖 Pokédex personnel
Visualisation de tous les Pokémon capturés par l'utilisateur (incluant les versions *shiny*). Pour inciter à la collection, **tous les Pokémon du jeu sont affichés, mais ceux qui n'ont pas encore été capturés apparaissent sous forme de silhouette noire**, rappelant le fameux *"Who's that Pokémon ?"*.
L'interface est également équipée de **nombreuses options de filtres** pour trier et chercher facilement dans sa collection.
> ![](https://github.com/user-attachments/assets/ac68a2b8-524c-483d-abd3-cfa82bd88e92)

### 📊 Statistiques détaillées
Suivi de l'évolution et de la progression de l'utilisateur quant à la complétion du *roster* complet, décomposé à travers de multiples catégories d'analyse (Générations, Types, Tags spéciaux).
> ![](https://github.com/user-attachments/assets/f98f75d3-dc3a-443a-b8cd-b0e8434e8f79)


### 🏆 Système de Succès (Achievements)
Des récompenses débloquées au fil de l'aventure. Chaque succès possède :
* Un niveau de rareté (**Bronze, Argent, Or, Platine**)
* Un numéro, un titre et une description
* Une valeur spécifique en points
* **Une statistique globale** : Le pourcentage d'obtention de ce succès par rapport à tous les joueurs ayant déjà débloqué au moins un succès.
* Les succès non obtenus ne montrent que leur numéro et leur pourcentage d'obtention au global, le reste est masqué pour éviter le spoil
> ![](https://github.com/user-attachments/assets/d47da27c-037d-434a-a57a-1f8aa8ed09b0)


### 🥇 Leaderboards
La compétition est à l'honneur avec **4 classements distincts** pour comparer ses exploits avec le reste de la communauté du stream.
> ![](https://github.com/user-attachments/assets/25d43cd3-3928-4545-92aa-2f7ac0935cbd)

---

## 🗄️ Structure des Données (MongoDB Atlas)

Le backend s'appuie sur une base de données **MongoDB** hébergée sur Atlas. Elle contient des collections de référence constituées à la main, qui correspondent exactement aux fichiers internes du jeu customisé.

### 1. Collection `Pokemons` (Dictionnaire de référence)
Cette collection liste les 230 Pokémon disponibles dans le jeu. Elle intègre un système de `tags`, de générations et de types qui permet au frontend de proposer des options de filtres très poussées.

```json
{
  "code": "0008",
  "name": "Carabaffe",
  "gen": 1,
  "tags": ["starter"],
  "type1": "water",
  "type2": ""
}
```
*(Exemple d'un pokemon avec un tag particulier avec le tag correspondant :)*

```json
{
  "code": "0080g",
  "name": "Flagadoss de Galar",
  "gen": 8,
  "tags": ["variant"],
  "type1": "psychic",
  "type2": "poison"
},
```
*(Exemple d'un pokemon avec une variation)*

### 2. Collection Achievements (Succès)
Tout comme les Pokémon, les succès sont pré-enregistrés dans la base. Le backend vérifie cette liste en temps réel à chaque nouvelle capture. La logique métier qui calcule si les conditions d'un succès sont remplies est centralisée dans le fichier checkAchievements.js.

```json
{
  "number": 1,
  "name": "Il faut un début à tout",
  "description": "Capturer son premier pokémon",
  "tier": "bronze",
  "value": 5
}
```

> ⚠️ **Note sur le projet** : Les données exactes de la base (ainsi que les assets du jeu *Lurk Bait* modifié) sont privées et exclusives à mon stream. Ce dépôt GitHub a pour but de présenter l'architecture web, le bot et le backend qui gravitent autour du jeu, mais il n'est pas conçu pour être déployé "clé en main" par un tiers sans ces fichiers de référence.
---

## 🎣 Format de détection (Le Bot en détail)

Le module `/bot` écoute les messages générés par **Lurk Bait** dans le chat Twitch lié à mon pseudo (ArchibaldWirslayd). Il utilise une expression régulière spécifique pour capter les annonces :

> `^Félicitation @(.+?) tu as attrapé un (.+?) qui pèse (.+?) et vaut (.+?) de pognon! Tu as désormais (.+?) de pognon!`

### Gestion des ID et Cas Spéciaux (Formes Régionales)
Le bot est capable d'extraire le numéro du Pokémon en 4 numeros (ex: "0129" pour Magicarpe) et de détecter s'il s'agit d'une version *(Shiny)*. 

De plus, il intègre un dictionnaire exhaustif pour gérer **toutes les formes régionales et cas spéciaux** (Méga-Évolutions, formes d'Alola/Galar/Hisui/Paldea, différences de genre, etc.). Par exemple :
* *Moyade Femelle* → Code `0593f`
* *Tritosor Mer Orient* → Code `0423e`
* *Superdofin forme Super* → Code `0964f`

Une fois le message parsé, un objet structuré est envoyé à l'API backend :
```json
{
  "pseudo": "viewer_name",
  "catch": {
    "code": "0423e",
    "shiny": true
  }
}
```
---


## 🔒 Statut du Projet & Utilisation
Ce projet a été développé spécifiquement pour mon propre usage et ma propre chaîne Twitch.

Par conséquent :

❌ Ce dépôt n'accepte pas les contributions externes (Pull Requests).

❌ Aucun support technique ou aide à l'installation ne sera fourni.

Cependant, vous êtes totalement libres de forker ce projet, d'étudier le code, de vous en inspirer ou de l'utiliser comme base pour créer votre propre système de votre côté !

(Si vous souhaitez lancer les modules en local pour explorer le code, vous devrez créer vos propres fichiers .env et recréer une base de données avec vos propres données de test via npm install et npm run start dans chaque dossier).
