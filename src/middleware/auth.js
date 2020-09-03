const jwt = require('jsonwebtoken');

function authe(req, res, next) {
    const auhteHeader = req.headers.authorization;
    const token = auhteHeader && auhteHeader.split(' ')[1];
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SCERET_KEY, (error, user) => {
      if (error) return res.status(401).send('invalid token');
      req.user = user;
      next();
    });
  }
module.exports = authe ;