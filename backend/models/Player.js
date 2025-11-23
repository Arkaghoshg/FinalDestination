const joi = require('joi');
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    username : {type:String,required:true,minlength:3,maxlength:15},
    points : {type:Number, default:0, required:true},
    lastUpdated : {type:Date, default: Date.now}
})

const Player = mongoose.model('Player',playerSchema);

function validateCategory(category){
    const schema = joi.object({
        username : joi.string().min(3).required(),
        points : joi.number().required(),
        lastUpdated : joi.date()
    });
    return schema.validate(category);
}

exports.Player = Player;
// exports.playerSchema = playerSchema;
exports.validateCategory = validateCategory;