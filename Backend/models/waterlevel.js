const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const levelSchema = new Schema({
    Date:{type: Date, required: true},
    ID:{type: String, required: true},
    Name:{type:String, required: true},
    'Flow Factor':{type: Number, required: true},
    Height:{type: Number, required: true},
    Level:{type: Number, required: true},
    'Max Capacity':{type: Number, required: true},
    'Process Level':{type: Number, required: true},
    Threshold:{type: Number, required: true}
},

{collection: 'level'}
);

module.exports = mongoose.model('WaterLevel', levelSchema);