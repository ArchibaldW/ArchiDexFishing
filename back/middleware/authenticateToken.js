const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: "Accès non autorisé : token manquant." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
        if (err) {
            return res.status(403).json({ message: "Accès interdit : token invalide." });
        }
        req.user = userPayload;
        next();
    });
}