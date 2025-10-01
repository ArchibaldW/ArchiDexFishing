const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    // 1. Récupérer l'en-tête 'Authorization'
    const authHeader = req.headers['authorization'];
    // Le format est "Bearer TOKEN". On récupère seulement le token.
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Vérifier si le token est présent
    if (token == null) {
        return res.status(401).json({ message: "Accès non autorisé : token manquant." });
    }

    console.log("test1")

    // 3. Vérifier la validité du token
    jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
        console.log("test2")
        if (err) {
            // Ex: Token expiré ou signature invalide
            return res.status(403).json({ message: "Accès interdit : token invalide." });
        }
        
        // 4. Le token est valide ! On attache les infos de l'utilisateur à la requête
        req.user = userPayload;
        
        // 5. On laisse la requête continuer vers sa destination
        console.log("test3")

        next();
    });
}