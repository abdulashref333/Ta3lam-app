const mongoose = require('mongoose');
const validator  = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:50,
        minlength:3,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate (value){
            if(!validator.isEmail(value)){
                throw new Error('invalid Email!');
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
        validate (value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password shouldn\'t contain \"password\"');
            }
        }
    },
    avatar:Buffer,
    isAdmin:Boolean
});

userSchema.methods.genrateToken = async function(){
    const token = await jwt.sign({"id":this._id.toString(), isAdmin:this.isAdmin},process.env.JWT_SCERET_KEY);
    return token;
}

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8);
    }
    next();
});

const User = mongoose.model('users',userSchema);
module.exports = {
    userSchema,
    User
}