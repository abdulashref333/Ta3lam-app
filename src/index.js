require('dotenv').config();
const express = require('express');
const user = require('./routes/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', user);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
