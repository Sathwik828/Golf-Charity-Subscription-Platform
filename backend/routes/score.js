const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/score');

router.post('/', scoreController.addScore);
router.get('/:userId', scoreController.getScores);

module.exports = router;
