const express = require('express');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const Story = require('../models/story');

const router = express.Router();

// Stories Index
router.get('/', (req, res) => {
    Story.find({status: 'public'})
        .populate('user')
        .sort({date: 'desc'})
        .then(stories => res.render('stories/index', {stories}))
        .catch(err => { console.log(err) });
});

// List Stories of a single User
router.get('/user/:id', (req, res) => {
    Story.find({user:req.params.id, status: 'public'})
        .populate('user')
        .sort({date: 'desc'})
        .then(stories => res.render('stories/index', {stories}))
        .catch(err => { console.log(err) });
});

// List My Stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({user:req.user.id})
        .populate('user')
        .sort({date: 'desc'})
        .then(stories => res.render('stories/index', {stories}))
        .catch(err => { console.log(err) });
});

// Add Story
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Process Add Story
router.post('/', (req, res) => {
    let allowComments = false;

    if(req.body.allowComments) {
        allowComments = true;
    }

    let newStory = new Story({
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    });

    newStory.save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        })
        .catch(err => console.log(err));
});

// Show Single Story
router.get('/show/:id', ensureAuthenticated, (req, res) => {
    Story.findById(req.params.id)
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            if(story.status === 'private') {
                if(story.user.id == req.user.id) {
                    // Only show user's Private story
                    res.render('stories/show', {story});
                } else {
                    res.redirect('/stories');
                }
            } else {
                res.render('stories/show', {story});
            }
        })
        .catch(err => console.log(err));
});

// Edit Story
router.get('/edit/:id', (req, res) => {
    Story.findById(req.params.id)
        .then(story => {
            if(story.user != req.user.id) {
                res.redirect('/stories');
            } else {
                res.render('stories/edit', {story})
            }
        })
        .catch(err => console.log(err));
});

// Process Edit Story
router.put('/:id', (req, res) => {
    Story.findById(req.params.id)
        .then(story => {
            let allowComments = false;

            if(req.body.allowComments) {
                allowComments = true;
            }

            story.title = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.allowComments = allowComments;

            story.save()
                .then(() => res.redirect('/dashboard'))
                .catch(err => console.log(err));
            
        })
        .catch(err => console.log(err));
});

// Delete Story
router.delete('/:id', (req, res) => {
    Story.deleteOne({ _id: req.params.id })
        .then(() => res.redirect('/dashboard'))
        .catch(err => console.log(err));
});

// Post Comment
router.post('/comment/:id', (req, res) => {
    Story.findById(req.params.id)
        .then(story => {
            let newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }

            story.comments.unshift(newComment);

            story.save()
                .then(() => res.redirect(`/stories/show/${story.id}`))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

module.exports = router;