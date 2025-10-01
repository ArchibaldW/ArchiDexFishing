const express = require("express");
const catchCtrl = require("../controllers/catch.js");
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

router.get("/", authenticateToken, catchCtrl.getCatches);

module.exports = router;