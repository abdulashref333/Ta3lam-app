const jwt = require('jsonwebtoken');
const {User} = require('../models/users');

async function authe(req, res, next) {
    const auhteHeader = req.headers.authorization;
    const token = auhteHeader && auhteHeader.split(' ')[1];
  
    if (!token) return res.sendStatus(400);
  try{
    
    const userId = jwt.verify(token, process.env.JWT_SCERET_KEY);
    const user = await User.findById(userId.id).exec();
    // console.log(user);
    req.user = user;
    next();

  } catch(error){
    res.status(401).send(error);
  }
}
module.exports = authe ;