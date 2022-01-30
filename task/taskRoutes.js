const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const taskController = require('./taskController');
const isAuth = require('../middleware/is_auth');

router.post('/add_task', isAuth, taskController.addTask);
router.get('/list_task', isAuth, taskController.listTask);
router.get('/detail_task/:taskId', isAuth, taskController.retrieveTask);
router.put('/update_task/:taskId', isAuth, taskController.updateTask);
router.delete('/delete_task/:taskId', isAuth, taskController.deleteTask);

module.exports = router;