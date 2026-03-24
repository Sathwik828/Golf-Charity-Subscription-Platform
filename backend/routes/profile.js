const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');

router.get('/:userId', profileController.getUserProfile);

module.exports = router;
