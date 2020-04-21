const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const waterlevelSchema = new Schema({
    apartment_id:{type: mongoose.Types.ObjectId, required: true, ref: 'Apartment'},
    water_level:{type: Number, required: true},
    time_stamp:{type:Date, required: true}
});

module.exports = mongoose.model('WaterLevel',waterlevelSchema);