const express = require('express');
const router = express.Router();
const {body, query} = require('express-validator');

const isAuth = require('../middleware/is_auth');
const commentController = require('../comment/commentController');

router.post('/add_comment', isAuth, commentController.addComment);
router.get('/list_comment', isAuth, commentController.listComment);

module.exports = router;
