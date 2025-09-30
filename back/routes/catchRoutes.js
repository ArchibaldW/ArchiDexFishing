const express = require("express");
const catchCtrl = require("../controllers/catch.js");

const router = express.Router();

router.get("/", catchCtrl.getCatches);

module.exports = router;