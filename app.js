require('./config');

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome to StoryBooks!');
});

// Use routes
app.use('/auth', auth);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});