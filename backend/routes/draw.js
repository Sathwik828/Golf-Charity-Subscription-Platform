const express = require('express');
const router = express.Router();
const drawController = require('../controllers/draw');

router.post('/run', drawController.runDraw);

module.exports = router;
