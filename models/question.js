const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    option: {
        type: [String],
        required: true,
    },
    keywords: {
        type: [String],
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
    },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
