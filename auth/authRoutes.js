const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('./authControllers');

const User = require('./user');
const isAuth = require('../middleware/is_auth');


router.put('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({ email: value}).then(userDoc => {
            if (userDoc){
                return Promise.reject('E-mail alread xists')
            }
        })
    })
    .normalizeEmail(),

    body('password')
    .trim()
    .isLength({ min: 5 }),

    body('name')
    .trim()
    .not()
    .isEmpty()
], authController.signup);

router.post('/signin', authController.signin);

router.get('/list_user', isAuth, authController.listUser)

module.exports = router;