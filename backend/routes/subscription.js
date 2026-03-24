const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription');

router.post('/create-checkout-session', subscriptionController.createCheckoutSession);

module.exports = router;
