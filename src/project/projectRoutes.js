const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const isAuth = require('../middleware/is_auth');
const projectController = require('../project/projectControllers');

router.post('/add_project', isAuth, projectController.createProject);
router.get('/list_project', isAuth, projectController.listProject);
router.get('/detail_project/:projectId', isAuth, projectController.retrieveProject);
router.patch('/update_project/:projectId', isAuth, projectController.updateProject);
router.delete('/delete_project/:projectId', isAuth, projectController.deleteProject);

module.exports = router;