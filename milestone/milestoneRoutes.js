const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const milestoneController = require('../milestone/milestoneController');
const isAuth = require('../middleware/is_auth');

router.post('/add_milestone', isAuth, milestoneController.addMilestone);

module.exports = router;