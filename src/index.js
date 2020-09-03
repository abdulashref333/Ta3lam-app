require('dotenv').config();
require('./db/mongoose.js');
const express = require('express');
const path = require('path');
const user = require('./routes/user');
const cours = require('./routes/cours');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'../public')));

app.use('/api/users', user);


app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
