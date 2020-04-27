const { validationResult } = require('express-validator');

const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const WaterLevel = require('../models/waterlevel');

const getWaterLevelById = async (req, res, next) => {
  const apartmentId = req.params.aid; 

  let apartment
  try {
    apartment = await WaterLevel.find({ ID:apartmentId });
    //console.log(apartment);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a apartment.',
      500
    );
    return next(error);
  }

  if (!apartment) {
    const error = new HttpError(
      'Could not find a apartment for the provided id.',
      404
    );
    return next(error);
  }

  //res.json({ apartment: apartment.toObject({ getters: true }) }); 
  res.json({ apartment: apartment.map(apartment => apartment.toObject({ getters: true })) });
};

exports.getWaterLevelById=getWaterLevelById;