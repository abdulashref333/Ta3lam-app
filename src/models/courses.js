const Joi = require('joi');
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        // minlength:50,
        trim:true
    },
    description:{
        type:String,
        required:true,
        // minlength:200,
        trim:true
    },
    genre:{
        type:String,
        required:true,
        trim:true
    },
    authors:[{
        name:{
            type:String,
            required:true
        }
    }],
    tags:[String],
    enrolledStud:{
        type:Number,
        default:0
    },
    reveiws:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'review',
        required:true
    },
    lessons:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'lesson',
        required:true
    },
    poster:String
},{timestamps:true});

function validateCourse(data) {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(50),
      genre: Joi.string().required(),
      authors:Joi.array().required().min(1),
      description:Joi.string().required(),
      lessons:Joi.array().required().min(1),
      tags:Joi.array().required().min(1)
    });
  
    return schema.validate(data);
}
function validateUpdates(data){
    const schema = Joi.object({
        authors:Joi.array().min(1),
        tags:Joi.array().min(1),
        name: Joi.string().min(3).max(50),
        genre: Joi.string(),
    })
    return schema.validate(data);

}
const Cours = mongoose.model('course',courseSchema);

module.exports = {
    Cours,
    validateCourse,
    validateUpdates
}