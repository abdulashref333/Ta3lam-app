require('dotenv').config();
require('./db/mongoose.js');
const express = require('express');
const path = require('path');
const user = require('./routes/user');
const cours = require('./routes/cours');
const Lesson = require('./routes/lessons');
const Review = require('./routes/reviews');
const dir = path.join(__dirname,'../public');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(dir));
app.use('/html', express.static(dir));

app.use('/api/users', user);
app.use('/api/courses', cours);
app.use('/api/lessons', Lesson);
app.use('/api/reviews',Review);
app.use(function (err, req, res, next) {
  // console.error(err.stack)
  res.status(500).send({error: err.message});
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
