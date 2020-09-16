const express = require('express');
const bcrypt = require('bcrypt');
const { User , validarUser} = require('../models/users.js');
const authe = require('../middleware/auth');
const admin = require('../middleware/isAdmin');
const fs = require('fs');
const path = require('path');
const {Cours} = require('../models/courses');
const multer = require('multer');

const upload = multer({
    dest:'public/avatars',
    limits:{
        fileSize:2000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/i)){
            return cb(new Error('please upload only image.'))
        }
        return cb(null,true);
    }
})
const route = express.Router();

route.post('/register', async (req, res) => {
  const { error } = validarUser(req.body);
  if (error){
      // handle errors later --------------------------
      errorMessage.push(error.details[0].message);
  } 
  // else {
  //     // 2- validate input from database
  // // const errors = await DB.new_User(ssid, email, phone_number, car_number);
  //     if(errors.length != 0) {
  //         // handle errors later ------------------------------------
  //         errorMessage = [...errorMessage, ...errors];
  //     }
  // }

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

route.post('/me/avatar', authe, upload.single('avatar'),  async (req, res) =>{
  try{
   
    req.user.avatar = '/avatars/' + req.file.filename ;
    await req.user.save();
 
    res.send(req.user);
  } catch(error){
    res.status(500).send(error.message);
  }
})

route.put('/me',authe, async(req, res) =>{

  const validUpdates = ['name', 'password', 'email'];
  try{
    
    for(let e in req.body){
      if(validUpdates.includes(e))
        req.user[e] = req.body[e];
    }

    await req.user.save();
    res.send(req.user);

  } catch(error) {
    res.status(500).send(error.message);
  }
});

route.put('/me/addcours/:id', authe, async(req, res) =>{
  try{

    if(req.user.courses.includes(req.params.id)) return res.status('400').send('alredy enrolled in this course');
    const cours = await Cours.findById(req.params.id).exec();

    req.user.courses.push(req.params.id);
    cours.enrolledStud ++ ;
    await cours.save();
    await req.user.save();

    res.send({user:req.user, cours});
  } catch(error){
    res.status(500).send(error.message);
  }
})

route.put('/me/rmcours/:id', authe, async(req, res) =>{
  try{
    const courses = req.user.courses;

    const index = courses.indexOf(req.params.id)
    if(index === -1) return res.status(404).send()
    req.user.courses.splice(index, 1);
    
    const cours = await Cours.findById(req.params.id).exec();
    cours.enrolledStud --;

    await cours.save();
    await req.user.save();  
    
    res.send({user:req.user, cours});
  } catch(error){

  }
})

route.delete('/me/avatar', authe , async(req, res) =>{
  fs.unlinkSync(path.join(__dirname, `../../public/${req.user.avatar}`))
  req.user.avatar = undefined;
  await req.user.save();
  res.send(req.user);
})

route.delete('/:id',[authe, admin], async(req, res) =>{
  try {
    const user = await User.findByIdAndRemove(req.params.id).exec();
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = route;