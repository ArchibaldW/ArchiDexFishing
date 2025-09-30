// /backend/routes/authRoutes.js
const express = require('express');
const authCtrl = require("../controllers/auth.js");

const router = express.Router();

router.post('/bot', authCtrl.getBotJwt);
router.get('/guest', authCtrl.getGuestJwt);

module.exports = router;