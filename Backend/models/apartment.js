const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
    title:{type: String, required: true},
    manager_id:{type: mongoose.Types.ObjectId, required: true, ref: 'Manager'},
    threshold:{type: Number, required: true}
});

module.exports = mongoose.model('Apartment',apartmentSchema);