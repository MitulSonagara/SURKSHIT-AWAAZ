const express = require("express")
const router = express.Router()
const FeedbackQuestion = require('../models/feedbackQuestions');
const feedbackResponses = require("../models/feedbackResponses")
const { execSync } = require('child_process');

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

    // let sentimentLabel
    
    // exec(`python sentimentAnalysis.py "${remarks}"`, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error: ${error.message}`);
    //         return res.status(500).send('Internal Server Error');
    //     }

    //     sentimentLabel = stdout.trim();
    // });

    const stdout = execSync(`python sentimentAnalysis.py "${remarks}"`, { encoding: 'utf-8' });

    const sentimentLabel = stdout.trim();

    const feedbackDocument = new feedbackResponses({
        district,
        policeStation,
        feedback: feedbackArray,
        remarks,
        type: sentimentLabel,
    });

    await feedbackDocument.save()
    res.send("thanks");
});


router.post('/feedback', (req, res) => {
    const inputText = req.body.remarks;

    // Call the Python script with the input text
    exec(`python sentimentAnalysis.py "${inputText}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }

        const sentimentLabel = stdout.trim();
        res.send(`Sentiment Label: ${sentimentLabel}`);
    });
});

module.exports = router