const express = require("express");
const userCtrl = require("../controllers/user.js");
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

router.get("/:pseudo", authenticateToken, userCtrl.getUserCatches);
router.post("/catch", authenticateToken, userCtrl.addUserCatch)

module.exports = router;