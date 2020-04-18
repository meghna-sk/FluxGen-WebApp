const {validationResult}= require('express-validator');

const HttpError = require('../models/http-error');

const Manager = require('../models/manager');

const getManagers = async (req,res,next) => {
    let managers;
    try{
        managers = await Manager.find({},'-password');
    } catch(err){
        const error = new HttpError('Fetching managers failed, try again later.', 500);
        return next(error);
    }

    res.json({ managers: managers.map( manager => manager.toObject({ getters:true }))});
    
};

const signup = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log(errors);
      return next( new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const { name, email, password }=req.body;

    let existingManager;

    try{
        existingManager = await Manager.findOne({email: email})
    } catch(err){
        const error = new HttpError('Signing up failed, please try again later.', 500);
        return next(error);
    }

    if(existingManager){
        const error= new HttpError('Manager exists already, please login instead.', 422);
        return next(error);
    }

    const createdManager= new Manager({
        name,
        email,
        password,
        apartments:[]
    });

    try{
        await createdManager.save(); 
    } catch(err){
        const error= new HttpError('Signing up failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({manager:createdManager.toObject({ getters:true })});
};

const login = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log(errors);
      throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }
    
    const {email,password}=req.body;

    let existingManager;
    try{
        existingManager = await Manager.findOne({email: email})
    } catch(err){
        const error = new HttpError('Logging in failed, please try again later.', 500);
        return next(error);
    }

    if (!existingManager || existingManager.password!==password){
        const error = new HttpError('Invalid credentials, could not login.', 401);
        return next(error);
    }


    res.json({message:'Logged in.'});
};

exports.getManagers=getManagers;
exports.signup=signup;
exports.login=login;
