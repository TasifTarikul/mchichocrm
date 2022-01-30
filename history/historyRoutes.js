const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const historyController = require('./historyController')
const isAuth = require('../middleware/is_auth');

router.get('/list_history', isAuth, historyController.listHistory);


module.exports = router