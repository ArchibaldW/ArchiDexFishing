const express = require("express");
const userCtrl = require("../controllers/user.js");

const router = express.Router();

router.get("/:pseudo", userCtrl.getUserCatches);
router.post("/catch", userCtrl.addUserCatch)

module.exports = router;