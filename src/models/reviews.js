const mongoose = require('mongoose');
const Joi = require('joi')

const reviewSchema = new mongoose.Schema({
    reviews:[{
        stars:{
            type:Number,
            required:true
        },
        content:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        }
    }]
},{timestamps:true});

function validateReview(data){
    const schema= Joi.object({
        content:Joi.string().required(),
        stars:Joi.number().max(5).min(0).required()
    })
    return schema.validate(data) ;
}

const Review  = mongoose.model('review',reviewSchema);
module.exports = {
    Review,
    validateReview
}