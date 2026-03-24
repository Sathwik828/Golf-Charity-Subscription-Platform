const express = require('express');
const router = express.Router();
const winnerController = require('../controllers/winner');

router.post('/verify', winnerController.verifyWin);
router.post('/approve', winnerController.approveWin);
router.get('/unverified', winnerController.getUnverifiedWinners);

module.exports = router;
