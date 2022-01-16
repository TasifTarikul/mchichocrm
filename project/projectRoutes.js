const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const isAuth = require('../middleware/is_auth');
const projectController = require('../project/projectControllers');

router.post('/add_project', isAuth, projectController.createProject);
router.get('/list_project', isAuth, projectController.listProject);


module.exports = router;