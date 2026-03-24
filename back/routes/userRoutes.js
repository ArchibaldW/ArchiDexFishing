const express = require("express");
const userCtrl = require("../controllers/user.js");
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

router.get("/pokedex", authenticateToken, userCtrl.getUserPokedex);
router.get('/statistics', authenticateToken, userCtrl.getUserStatistics)
router.get("/achievements", authenticateToken, userCtrl.getUserAchievements)

router.post("/catch", authenticateToken, userCtrl.addUserCatch)

module.exports = router;