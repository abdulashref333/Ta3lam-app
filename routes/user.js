const express = require('express');

const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.send('Home Page');
})

// Login
router.get('/login', async (req, res) => {
    res.send('Login page');
});
router.post('/login', async (req, res) => {
    res.send(req.body);
});

// Register
router.get('/register', async (req, res) => {
    res.send('Register Page');
});
router.post('/register', async (req, res) => {
    res.send(req.body);
});

module.exports = router;
