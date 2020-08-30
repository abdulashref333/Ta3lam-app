const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const user = require('./routes/user');

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routers
app.use('/user', user);

// listenning on port 3000
server.listen(3000, () => {
    console.log('listening on port:3000');
});
