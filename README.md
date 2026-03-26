# 🎣 ArchiDexFishing

🇫🇷 *[Read this documentation in French](./README.fr.md)*

> **An interactive full-stack project allowing Twitch viewers to catch, collect, and track their water-type Pokémon in real-time via a personal Pokédex.**

ArchiDexFishing works in synergy with the fishing game **[Lurk Bait Twitch Fishing](https://blam.cam/)**, which has been heavily customized for this occasion. When a viewer catches a Pokémon on stream, the game announces it in the chat. Our ecosystem intercepts this message, logs it, calculates achievements in real-time, and the viewer can immediately admire their catch, stats, and ranking on the dedicated web interface!

---

## 📑 Table of Contents
1. [How does it work?](#-how-does-it-work)
2. [Project Architecture](#-project-architecture)
3. [Technologies Used](#-technologies-used)
4. [Frontend Features (Web App)](#-frontend-features-web-app)
5. [Data Structure (MongoDB Atlas)](#data-structure)
6. [Detection Format (Bot Details)](#-detection-format-bot-details)
7. [Acknowledgements (Shoutout)](#acknowledgements)
8. [Project Status & Usage](#-project-status--usage)

---

## 🔄 How does it work?

The data flow occurs in 4 key steps:

1. **Third-party fishing game ([Lurk Bait Twitch Fishing](https://blam.cam/))**: Viewers interact with the game directly on stream. The game has been **entirely customized** for the Pokémon universe: it exclusively allows the capture of Water-type Pokémon or those belonging to a Water egg group. With **230 available Pokémon** (in both normal and *shiny* versions), the game features their real cries, true weights, and a value tied to their rarity. Once a Pokémon is caught, the game announces the catch in the Twitch chat.
2. **Twitch Bot**: Constantly listens to the chat, detects catch messages validated by the game, and extracts data about the player and the caught Pokémon. It is also responsible for announcing in the chat any achievements unlocked by a player after a catch.
3. **Backend**: Receives data from the bot and updates the database by adding the catch to the user's profile. Achievements are calculated in real-time during this step: if a player unlocks an achievement, the backend sends a message to the bot so it can display it instantly in the Twitch chat. This data is also made available to the web application.
4. **Frontend**: Retrieves data from the backend to display the players' progress, collection, and achievements in real-time.

---

## 🏗 Project Architecture

The monorepo repository is divided into three main folders:

* 📁 **/front**: The web user interface developed in Vue.js. It queries the backend to display the interactive Pokédex, stats, achievements, and leaderboards.
* 📁 **/back**: The main server. It handles the business logic, database connection, achievement calculation, and serves as the central API between the bot and the frontend.
* 📁 **/bot**: Connected to the Twitch API, it reads the chat, filters Lurk Bait announcements, sends catch data to the backend, and relays achievement announcements in the chat.

---

## 💻 Technologies Used

* **Frontend**: Vue.js, Nuxt.Js, JavaScript, SCSS
* **Backend**: Node.js, Express, MongoDB
* **Bot**: Node.js, Twitch API (e.g., tmi.js / Twitch.js)
* **Third-Party Game**: Lurk Bait Twitch Fishing (Customized)

---

## ✨ Frontend Features (Web App)

The web application is the ultimate dashboard for viewers, offering a rich and detailed experience:

### 📖 Personal Pokédex
Visualization of all Pokémon caught by the user (including *shiny* versions). To encourage collection, **all Pokémon in the game are displayed, but those not yet caught appear as black silhouettes**, reminiscent of the famous *"Who's that Pokémon?"*.
The interface also features **numerous filter options** to easily sort and search through the collection.
> ![](https://github.com/user-attachments/assets/ac68a2b8-524c-483d-abd3-cfa82bd88e92)

### 📊 Detailed Statistics
Tracking of the user's evolution and progress towards completing the entire *roster*, broken down across multiple analytical categories (Generations, Types, Special Tags).
> ![](https://github.com/user-attachments/assets/f98f75d3-dc3a-443a-b8cd-b0e8434e8f79)

### 🏆 Achievement System
Rewards unlocked throughout the adventure. Each achievement has:
* A rarity tier (**Bronze, Silver, Gold, Platinum**)
* A number, title, and description
* A specific point value
* **A global stat**: The completion percentage of this achievement compared to all players who have unlocked at least one achievement.
* Unlocked achievements only show their number and global completion percentage; the rest is hidden to prevent spoilers.
> ![](https://github.com/user-attachments/assets/d47da27c-037d-434a-a57a-1f8aa8ed09b0)

### 🥇 Leaderboards
Competition takes center stage with **4 distinct rankings** to compare feats with the rest of the stream community.
> ![](https://github.com/user-attachments/assets/25d43cd3-3928-4545-92aa-2f7ac0935cbd)

---

## 🗄️ <a id="data-structure"></a> Data Structure (MongoDB Atlas)


The backend relies on a **MongoDB** database hosted on Atlas. It contains reference collections built manually, which correspond exactly to the customized game's internal files.

### 1. `Pokemons` Collection (Reference Dictionary)
This collection lists the 230 Pokémon available in the game. It incorporates a system of `tags`, generations, and types that allows the frontend to offer advanced filtering options.

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
*(Example of a Pokémon with a specific tag:)*

```json
{
  "code": "0080g",
  "name": "Flagadoss de Galar",
  "gen": 8,
  "tags": ["variant"],
  "type1": "psychic",
  "type2": "poison"
}
```
*(Example of a Pokémon with a variation)*

### 2. `Achievements` Collection
Like the Pokémon, achievements are pre-registered in the database. The backend checks this list in real-time with every new catch. The business logic that calculates whether achievement conditions are met is centralized in the `checkAchievements.js` file.

```json
{
  "number": 1,
  "name": "Il faut un début à tout",
  "description": "Capturer son premier pokémon",
  "tier": "bronze",
  "value": 5
}
```

> ⚠️ **Project Note**: The exact database data (as well as the assets for the modified *Lurk Bait* game) are private and exclusive to my stream. The purpose of this GitHub repository is to showcase the web architecture, bot, and backend built around the game, but it is not designed to be a "plug-and-play" deployment for a third party without these reference files.

---

## 🎣 Detection Format (Bot Details)

The `/bot` module listens to messages generated by **Lurk Bait** in the Twitch chat linked to my username (ArchibaldWirslayd). It uses a specific regular expression to capture announcements:

> `^Félicitation @(.+?) tu as attrapé un (.+?) qui pèse (.+?) et vaut (.+?) de pognon! Tu as désormais (.+?) de pognon!`

### Handling IDs and Special Cases (Regional Forms)
The bot can extract the 4-digit Pokémon number (e.g., "0129" for Magikarp) and detect if it is a *(Shiny)* version.

Furthermore, it integrates an exhaustive dictionary to handle **all regional forms and special cases** (Mega Evolutions, Alola/Galar/Hisui/Paldea forms, gender differences, etc.). For example:
* *Female Jellicent (Moyade Femelle)* → Code `0593f`
* *East Sea Gastrodon (Tritosor Mer Orient)* → Code `0423e`
* *Hero Form Palafin (Superdofin forme Super)* → Code `0964f`

Once the message is parsed, a structured object is sent to the backend API:

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

## <a id="acknowledgements"></a>🙏 Acknowledgements (Shoutout)

A huge shoutout to Jimauve for providing the initial base code for the Twitch bot. Their work gave me a solid foundation to build upon before integrating all the custom ArchiDexFishing logic (the complex regex, the achievement system, and the backend communication)!

Feel free to check out their **[Twitch channel](https://www.twitch.tv/jimauve)**

---

## 🔒 Project Status & Usage

This project was developed specifically for my own use and my own Twitch channel.

Therefore:

* ❌ **This repository does not accept external contributions (Pull Requests).**
* ❌ **No technical support or installation help will be provided.**

However, you are completely free to **fork this project**, study the code, draw inspiration from it, or use it as a base to create your own system!

*(If you wish to run the modules locally to explore the code, you will need to create your own `.env` files and recreate a database with your own test data via `npm install` and `npm run start` in each folder).*
