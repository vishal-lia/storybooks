require('./config');

const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => { console.log('MongoDB connected'); })
    .catch(err => console.log(err));

const app = express();
const port = process.env.PORT || 3000;

// Passport Config
require('./config/passport')(passport);

// Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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

// Use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});