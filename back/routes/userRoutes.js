const express = require("express");
const userCtrl = require("../controllers/user.js");
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();
// ---- LIGNES DE DEBUG ----
console.log('Contenu de authenticateToken:', authenticateToken);
console.log('Type de authenticateToken:', typeof authenticateToken);

router.get("/:pseudo", authenticateToken, userCtrl.getUserCatches);
router.post("/catch", authenticateToken, userCtrl.addUserCatch)

module.exports = router;