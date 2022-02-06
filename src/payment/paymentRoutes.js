const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is_auth');
const paymentController = require('./paymentController');

router.post('/add_payment', isAuth, paymentController.addPayment);

module.exports = router;