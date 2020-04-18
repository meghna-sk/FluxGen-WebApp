const express = require('express');
const {check}= require('express-validator');

const managersControllers = require('../controllers/managers-controllers');

const router = express.Router();

router.get('/', managersControllers.getManagers);

router.post('/signup', [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6})], managersControllers.signup);

router.post('/login', [check('email').normalizeEmail().isEmail()], managersControllers.login);

module.exports = router;
