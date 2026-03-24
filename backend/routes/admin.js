const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/overview', adminController.getAdminOverview);
router.get('/users', adminController.getAllUsers);

module.exports = router;
