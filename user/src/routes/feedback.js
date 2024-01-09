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


// Example route for handling feedback submission
router.post('/feedback', async (req, res) => {
    const feedbackData = req.body.questions;
    const { district, policeStation, remarks } = req.body;

    const feedbackArray = [];

    for (const questionId in feedbackData) {
        const questionText = feedbackData[questionId].questionText;
        const response = feedbackData[questionId].response;

        feedbackArray.push({
            questionText,
            response,
        });
    }

    const feedbackDocument = new feedbackResponses({        
        district,
        policeStation,
        feedback: feedbackArray,
        remarks,
        type:"positive",
    });

    await feedbackDocument.save()
    res.send("thanks");
});

module.exports = router