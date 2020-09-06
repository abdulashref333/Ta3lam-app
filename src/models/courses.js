const mongoose = require('mongoose');
const validator  = require('validator');

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
    reviews:[{
        stars:Number,
        content:String,
        username:String,
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    }],
    lessons:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'lesson'
    }
},{timestamps:true});
module.exports = mongoose.model('cours',courseSchema);