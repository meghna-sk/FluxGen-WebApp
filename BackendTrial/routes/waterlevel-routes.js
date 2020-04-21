const express = require('express');

const waterlevelControllers = require('../controllers/waterlevel-controllers');

const router = express.Router();

router.get('/:aid', waterlevelControllers.getWaterLevelById);


module.exports = router;
