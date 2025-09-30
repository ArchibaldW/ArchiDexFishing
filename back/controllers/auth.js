const jwt = require('jsonwebtoken');

exports.getBotJwt = (req, res) => {
    const botSecret = req.headers['x-bot-secret'];

    if (!botSecret || botSecret !== process.env.BOT_API_SECRET) {
        return res.status(401).send("Accès non autorisé");
    }

    // Le secret est bon, on génère un JWT pour le bot
    const payload = { role: 'bot', service: 'twitch-bot' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
}

exports.getGuestJwt = (req, res) => {
    // Pas de secret requis, c'est une route publique
    const payload = { role: 'guest', session: Math.random().toString(36).substring(7) };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token });
}