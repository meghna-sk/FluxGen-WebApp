const { validationResult } = require('express-validator');

const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Apartment = require('../models/apartment');

const Manager = require('../models/manager');


const getApartmentById = async (req, res, next) => {
  const apartmentId = req.params.aid; 

  let apartment
  try {
    apartment = await Apartment.findById(apartmentId);
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

  res.json({ apartment: apartment.toObject({ getters: true }) }); 
};


const getApartmentByManagerId = async (req, res, next) => {
  const managerId = req.params.mid;

  let apartments;
  try {
    apartments = await Apartment.find({ manager_id: managerId });
  } catch (err) {
    const error = new HttpError(
      'Fetching apartment(s) failed, please try again later',
      500
    );
    return next(error);
  }

  if (!apartments || apartments.length === 0) {
    return next(
      new HttpError('Could not find apartment(s) for the provided manager id.', 404)
    );
  }

  res.json({ apartments: apartments.map(apartment => apartment.toObject({ getters: true })) });
};

const createApartment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, manager_id, threshold } = req.body;


  const createdApartment = new Apartment({
    title,
    manager_id,
    threshold
  });

  let manager;

  try{
    manager= await Manager.findById(manager_id);

  } catch(err){
    const error = new HttpError('Creating apartment failed, please try again.', 500);
    return next(error);
  }

  if(!manager){
    const error= new HttpError('Could not find manager for provided Id.', 404);
    return next(error);
  }

  console.log(manager);

  try {
    const sess =  await mongoose.startSession();
    sess.startTransaction();
    await createdApartment.save({ session:sess });
    manager.apartments.push(createdApartment);
    await manager.save({session: sess});
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating apartment failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdApartment });
};



const updateApartment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next( new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, threshold } = req.body;
  const apartmentId = req.params.aid;

  let apartment;
  try {
    apartment = await Apartment.findById(apartmentId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update apartment.',
      500
    );
    return next(error);
  }

  apartment.title = title;
  apartment.threshold = threshold;

  try {
    await apartment.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update apartment.',
      500
    );
    return next(error);
  }

  res.status(200).json({ apartment: apartment.toObject({ getters: true }) });
};

const deleteApartment = async (req, res, next) => {
  const apartmentId = req.params.aid;

  let apartment;
  try {
    apartment = await Apartment.findById(apartmentId).populate('manager_id');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete apartment.',
      500
    );
    return next(error);
  }

  if(!apartment){
    const error= new HttpError('Could not find an apartment for this id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await apartment.remove({session: sess});
    apartment.manager_id.apartments.pull(apartment);
    await apartment.manager_id.save({session:sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete apartment.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted apartment.' });
};

exports.getApartmentById = getApartmentById;
exports.getApartmentByManagerId = getApartmentByManagerId;
exports.createApartment = createApartment;
exports.updateApartment = updateApartment;
exports.deleteApartment = deleteApartment;
