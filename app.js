require('./config');

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

// Load Routes
const auth = require('./routes/auth');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => { console.log('MongoDB connected'); })
    .catch(err => console.log(err));

const app = express();
const port = process.env.PORT || 3000;

// Passport Config
require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 60 * 60 * 1000 // 1hr
    },
    resave: false,
    saveUninitialized: false
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome to StoryBooks!');
});

// Use routes
app.use('/auth', auth);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});