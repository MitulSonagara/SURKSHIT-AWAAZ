const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    title: String,
    questions: [String],
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;