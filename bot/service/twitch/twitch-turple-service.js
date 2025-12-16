const { Bot } = require("@twurple/easy-bot");
const { RefreshingAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");
const fs = require('fs');
const path = require('path');

const TOKEN_FILE = path.join(__dirname, 'tokens.json')

class TwitchTurpleService {
  constructor() {
    this.authProvider = null;
    this.bot = null;
    this.apiClient = null;
    this.channel = "";
    this.userId = "";
  }

  /**
   * Démarre et connecte le bot au chat Twitch.
   */
  start = async (
    userId,
    clientId,
    clientSecret,
    accessToken,
    refreshToken,
    channel
  ) => {
    this.channel = channel;
    this.userId = userId;

    let tokenData = null;

    if (fs.existsSync(TOKEN_FILE)) {
        try {
            tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'UTF-8'));
            console.log("📂 Tokens chargés depuis tokens.json (Sauvegarde locale)");
        } catch(e) {
            console.error("Erreur lecture tokens.json, retour au .env");
        }
    }

    if (!tokenData) {
        console.log("⚠️ Pas de tokens.json, utilisation des variables d'environnement (.env)");
        tokenData = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresIn: 0,
            obtainmentTimestamp: 0
        };

        try {
            fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 4), 'UTF-8');
            console.log("💾 Création initiale du fichier tokens.json avec les données du .env");
        } catch (err) {
            console.error("❌ Impossible de créer tokens.json au démarrage", err);
        }
    }

    this.authProvider = new RefreshingAuthProvider({
      clientId,
      clientSecret,
      onRefresh: async (userId, newTokenData) => {
        const dataToSave = {
            accessToken: newTokenData.accessToken,
            refreshToken: newTokenData.refreshToken,
            expiresIn: newTokenData.expiresIn,
            obtainmentTimestamp: newTokenData.obtainmentTimestamp
        };
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(dataToSave, null, 4), 'UTF-8');
        console.log("💾 Tokens rafraîchis et sauvegardés dans tokens.json !");
      }
    });

    await this.authProvider.addUserForToken(
      tokenData,
      ['chat']
    );

    // Initialisation du client d'API pour d'éventuels appels simples
    this.apiClient = new ApiClient({
      authProvider: this.authProvider,
    });

    // Création de l'instance du bot pour interagir avec le chat
    this.bot = new Bot({
      authProvider: this.authProvider,
      channels: [this.channel],
    });

    console.log(`✅ TwitchTurpleService : Bot prêt sur la chaîne #${this.channel}`);

    const currentToken = await this.authProvider.getAccessTokenForUser(this.userId);
    return currentToken ? currentToken.accessToken : accessToken;
  };

  /**
   * Envoie un message dans le chat du stream.
   * @param {string} message Le message à envoyer.
   */
  say(message) {
    if (!this.bot) {
      console.error("❌ Erreur : Le bot n'est pas démarré. Appelez start() d'abord.");
      return;
    }
    try {
      this.bot.say(this.channel, message);
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message :", error);
    }
  }

  /**
   * Attache une fonction à exécuter à chaque message reçu dans le chat.
   * @param {(data: { text: string, userName: string, userDisplayName: string, isMod: boolean }) => void} handler La fonction à exécuter.
   */
  onMessage(handler) {
    if (!this.bot) {
      console.error("❌ Erreur : Le bot n'est pas démarré. Appelez start() d'abord.");
      return;
    }
    this.bot.onMessage(async (data) => {
      // On passe un objet simplifié au handler pour une utilisation plus facile
      handler({
        text: data.text,
        userName: data.userName,
        userDisplayName: data.userDisplayName,
        isMod: data.userInfo.isMod,
      });
    });
  }
}

module.exports = TwitchTurpleService;