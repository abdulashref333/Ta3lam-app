const mongoose = require('mongoose');
const validator  = require('validator');
const Joi = require('joi');

const lesson = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    link:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ('it is an invalid link!')
            }
        }
    }
})
const lessonsSchema = new mongoose.Schema({
    lessons:[{
        type:lesson,
        required:true
    }]
},{timestamps:true});

function validateLessonUpdate(data){
    const schema = Joi.object({
        lessons:Joi.array().length(1).required()
    });
    return schema.validate(data);
}

const Lesson = mongoose.model('lesson', lessonsSchema);
module.exports = {
    Lesson,
    validateLessonUpdate
}