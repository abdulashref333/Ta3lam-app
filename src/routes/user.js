const express = require('express');
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/users.js');

const route = express.Router();

route.post('/register', async (req, res) => {
  
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  
  try{
    await user.save();
    const token = await user.genrateToken();
    res.send({user, token});
  } catch(e){
    res.status(400).send({error:e});
  }  
});

route.post('/login', async (req, res) => {
  // find the user from data base useing uniqe identifire like email ...
  try{
    const user = await User.findOne({email:req.body.email});
    if (!user) return res.status(404).send('Email or password is incorrect!');
  
    const isPassed = await bcrypt.compare(req.body.password, user.password);
    if (!isPassed) return res.status(404).send('Email or password is incorrect!');
  
    // generate jwt
    const token = await user.genrateToken();
    res.json({user,token});    
  } catch(e){
    res.status(500).send({error:e});
  }
});

module.exports = route;
