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

exports.getTwitchCallback = async (req, res) => {
    // a. Récupérer le code temporaire envoyé par Twitch
    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Erreur : code manquant.");
    }

    try {
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.API_URL + '/api/auth/twitch/callback'
            })
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // c. Utiliser l'access_token pour récupérer les infos de l'utilisateur
        const userResponse = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        });
        const userData = await userResponse.json();
        const twitchUser = userData.data[0];

         const user = await User.findOne({_id : twitchUser.login});


        if(!user) {
            const newUser = new User({
                _id: twitchUser.login,
                pseudo: twitchUser.login,
                catches: []
            })

            await user.save()
        }

        const payload = { 
            userId: twitchUser.id,
            username: twitchUser.login,
            avatar: twitchUser.profile_image_url
        };
        
        const ourJwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        // e. On stocke le JWT dans un cookie sécurisé et on redirige l'utilisateur
        res.cookie('auth_token', ourJwtToken, {
            httpOnly: false, // Le cookie n'est pas accessible en JS côté client
            secure: true,   // Uniquement en HTTPS
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });

        // Redirige l'utilisateur vers le tableau de bord de ton front-end
        res.redirect(process.env.SITE_URL);

    } catch (error) {
        console.error("Erreur durant l'authentification Twitch:", error);
        res.status(500).send("Une erreur est survenue.");
    }
};