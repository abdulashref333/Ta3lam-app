const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const route = express.Router();

const users = [];
const posts = [
  {
    username: 'Abdulrahman',
    post: 'post 1',
  },
  {
    username: 'khaled',
    post: 'post2',
  },
];

function authe(req, res, next) {
  const auhteHeader = req.headers.authorization;
  const token = auhteHeader && auhteHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  return jwt.verify(token, process.env.JWT_SECRET_KEY, (er, user) => {
    if (er) return res.status(401).send('invalid token');
    req.user = user;
    next();
  });
}

//this route for testing ...
route.get('/posts', authe, (req, res) => {
  // console.log(users);
  const post = posts.find((pos) => pos.username === req.user.name);
  console.log(post);
  if (!post) return res.status(404).send('ther is no posts for you ');
  return res.json(post);
});

route.post('/register', async (req, res) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  };
    // save user to database
  users.push(user);
  // genrate jwt for user ....
  res.send(user);
});

route.post('/login', async (req, res) => {
  // find the user from data base useing uniqe identifire like email ...

  const user = users.find((user) => user.email === req.body.email);
  if (!user) return res.status(404).send('Email or password is incorrect!');

  const isPassed = await bcrypt.compare(req.body.password, user.password);
  if (!isPassed) return res.status(404).send('Email or password is incorrect!');

  // generate jwt
  const accessToken = jwt.sign(user, process.env.JWT_SECRET_KEY);

  res.json(accessToken);
});

module.exports = route;
