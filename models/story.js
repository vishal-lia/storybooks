const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    commentBody: {
        type: String,
        required: true
    },
    commentDate: {
        type: Date,
        default: Date.now
    },
    commentUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const StorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        default: 'true'
    },
    comments: [CommentSchema],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'      
    },
    date: {
        type: Date,
        default: Date.now        
    }
});

const Story = mongoose.model('Story', StorySchema, 'stories');

module.exports = Story;