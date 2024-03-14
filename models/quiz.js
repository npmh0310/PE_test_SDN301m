const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Question = require('./question');

const quizSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;