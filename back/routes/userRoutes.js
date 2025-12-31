const express = require("express");
const userCtrl = require("../controllers/user.js");
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

router.get("/catches", authenticateToken, userCtrl.getUserCatches);
router.get('/statistics', authenticateToken, userCtrl.getUserStatistics)
router.post("/catch", authenticateToken, userCtrl.addUserCatch)

module.exports = router;