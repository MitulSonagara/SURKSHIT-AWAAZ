const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    survey: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
    answers: [{ question: String, answer: String }],
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;