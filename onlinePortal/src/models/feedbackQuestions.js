const mongoose = require("mongoose")

const feedbackQuestionSchema = new mongoose.Schema({
    questionId: { type: String, unique: true },
    questionText: String,
    questionType: {
        type: String,
        enum: ['text', 'multiple-choice'], // Define the question types
        required: true,
    },
    options: [
        {
            type: String,
        },
    ],
});

module.exports = mongoose.model("FeedbackQuestion", feedbackQuestionSchema)