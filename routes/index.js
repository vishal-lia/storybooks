const express = require('express');
const Story = require('../models/story');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const router = express.Router();

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

router.get('/about', (req, res) => {
    res.render('index/about');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Story.find({user: req.user.id})
        .then(stories => { 
            res.render('index/dashboard', {stories})
        })
        .catch(err => console.log(err));
});

module.exports = router;