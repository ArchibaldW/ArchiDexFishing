const { Bot } = require("@twurple/easy-bot");
const { RefreshingAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");

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

    // Configuration de l'authentification qui se rafraîchit automatiquement
    this.authProvider = new RefreshingAuthProvider({
      clientId,
      clientSecret,
    });

    await this.authProvider.addUserForToken(
      {
        accessToken,
        refreshToken,
        expiresIn: 0, // Laisse la librairie gérer l'expiration
        obtainmentTimestamp: 0,
        scopes : ["chat:read", "chat:edit"]
      },
      // Le strict minimum de scopes pour lire et écrire dans le chat
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