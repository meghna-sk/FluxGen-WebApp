const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const Schema= mongoose.Schema;

const managerSchema= new Schema({
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true, minlength: 6},
    apartments: [{type: mongoose.Types.ObjectId, required: true, ref: 'Apartment'}]
});

managerSchema.plugin(uniqueValidator);     

module.exports = mongoose.model('Manager', managerSchema);