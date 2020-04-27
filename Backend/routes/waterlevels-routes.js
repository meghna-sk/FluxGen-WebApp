const express = require('express');

const {check}= require('express-validator');

const waterlevelsControllers = require('../controllers/waterlevels-controllers');

const router = express.Router();

router.get('/:aid', waterlevelsControllers.getWaterLevelById);

module.exports = router;
