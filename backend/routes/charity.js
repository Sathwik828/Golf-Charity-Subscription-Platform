const express = require('express');
const router = express.Router();
const charityController = require('../controllers/charity');

router.get('/', charityController.getCharities);
router.post('/update', charityController.updateUserCharity);
router.post('/seed', charityController.seedCharities);

module.exports = router;
