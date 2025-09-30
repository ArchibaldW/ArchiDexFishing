const TwitchService = require("./service/twitch/twitch-service");
const TwitchTurpleService = require("./service/twitch/twitch-turple-service");
const botWebSocket = require("./service/bot/botWebSocket.js");

(async () => {
  const twitchService = new TwitchService();
  await twitchService.start(
    process.env.TWITCH_BOT_USERNAME,
    process.env.TWITCH_OAUTH_TOKEN,
    process.env.TWITCH_CHANNEL_NAME
  );

  console.log(
    "TwitchService → Track chat from: https://twitch.tv/" +
      process.env.TWITCH_CHANNEL_NAME
  );

  const twitchTurpleService = new TwitchTurpleService();
  await twitchTurpleService.start(
    process.env.TWITCH_USER_ID,
    process.env.TWITCH_CLIENT_ID,
    process.env.TWITCH_CLIENT_SECRET,
    process.env.ACCESS_TOKEN,
    process.env.REFRESH_TOKEN,
    process.env.TWITCH_CHANNEL_NAME,
    process.env.TWITCH_BOT_USERNAME
  );
  console.log(
    "TwitchService → Track chat from: from: https://twitch.tv/" +
      process.env.TWITCH_BOT_USERNAME
  );

  botWebSocket.start();

  const fishingRegex = /^Félicitation @(.+?) tu as attrapé un (.+?) qui pèse (.+?) et vaut (.+?) de pognon! Tu as désormais (.+?) de pognon!/;
  const specialCases = [
    { "code": "0422e", "name": "Sancoki Mer Orient" },
    { "code": "0422o", "name": "Sancoki Mer Occident" },
    { "code": "0423e", "name": "Tritosor Mer Orient" },
    { "code": "0423o", "name": "Tritosor Mer Occident" },
    { "code": "0550b", "name": "Bargantua Bleu" },
    { "code": "0550r", "name": "Bargantua Rouge" },
    { "code": "0592f", "name": "Viskuse Femelle" },
    { "code": "0592m", "name": "Viskuse Mâle" },
    { "code": "0593f", "name": "Moyade Femelle" },
    { "code": "0593m", "name": "Moyade Mâle" },
    { "code": "0746b", "name": "Froussardine en banc" },
    { "code": "0845g", "name": "Nigosier Gobe-chu" },
    { "code": "0964f", "name": "Superdofin forme Super" },
    { "code": "0978c", "name": "Nigirigon forme Courbée" },
    { "code": "0978a", "name": "Nigirigon forme Affalée" },
    { "code": "0978r", "name": "Nigirigon forme Raide" }
  ];

  const specialCasesMap = new Map(specialCases.map(item => [item.name, item.code]));
  twitchService.addOnMessage(
    async (msg, context) => {
      if (context.username === 'archibaldwirslayd') {
        const match = msg.match(fishingRegex);

        if (match) {
          const capturedUser = match[1].toLowerCase();
          const capturedCatch = match[2];

          let finalFish = {code : '', shiny : false};

          finalFish.shiny = capturedCatch.includes('(Shiny)');

          // On extrait le nom du poisson (tout ce qui est après " - " et avant " (shiny)")
          const namePartMatch = capturedCatch.match(/ - (.*?)(?:\s\(Shiny\))?$/);

          if (namePartMatch) {
            const fishName = namePartMatch[1]; // ex: "Sancoki Mer Orient"

            // On regarde si ce nom est un cas spécial
            if (specialCasesMap.has(fishName)) {
              // Si oui, on prend le code spécial
              finalFish.code = specialCasesMap.get(fishName);
            } else {
              // Si non, on applique la logique normale pour extraire l'ID numérique
              const idMatch = capturedCatch.match(/(\d+)/);
              if (idMatch) {
                finalFish.code = idMatch[1];
              }
            }
          }

          try {
            const res = await fetch(`${process.env.API_URL}/api/users/catch`, {
              method: 'POST',
              body: JSON.stringify({
                'pseudo' : capturedUser,
                'catch' : finalFish
              }),
              headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error('Erreur API');
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  )
})();

