const express = require('express');

const {check}= require('express-validator');

const apartmentsControllers = require('../controllers/apartments-controllers');

const router = express.Router();

router.get('/:aid', apartmentsControllers.getApartmentById);

router.get('/manager/:mid', apartmentsControllers.getApartmentByManagerId);

router.post('/', [check('title').not().isEmpty(), check('manager_id').not().isEmpty(), check('threshold').not().isEmpty()], apartmentsControllers.createApartment);

router.patch('/:aid', [check('title').not().isEmpty(), check('threshold').not().isEmpty()], apartmentsControllers.updateApartment);

router.delete('/:aid', apartmentsControllers.deleteApartment);

module.exports = router;
