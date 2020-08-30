const express = require('express');
const bodyParser = require('body-parser');
const user = require('../routes/user');

const app = express();

// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routers
app.use('/user', user);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server is running on port${port}`));
