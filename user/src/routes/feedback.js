const express = require("express")
const router = express.Router()
const FeedbackQuestion = require('../models/feedbackQuestions');
const feedbackResponses = require("../models/feedbackResponses")

router.get("/", async (req, res) => {
    try {
        // Retrieve questions from the database
        const questions = await FeedbackQuestion.find()
        res.render('feedback', { questions });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router