const express = require("express")
const router = express.Router()
const FeedbackQuestion = require('../models/feedbackQuestions');
const feedbackResponses = require("../models/feedbackResponses")
const stations = require("../models/stations")
const { execSync } = require('child_process');
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
    try {
        // Retrieve questions from the database
        const stationId = req.query.stationId
        const stationData = await stations.findOne({ "_id": stationId })
        // console.log(stationData.name)
        const questions = await FeedbackQuestion.find()
        res.render('feedback', { questions, stationId, stationData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


// Example route for handling feedback submission
router.post('/feedback', async (req, res) => {
    const feedbackData = req.body.questions;
    const { remarks } = req.body;
    const stationId = req.body.stationId

    const feedbackArray = [];

    for (const questionId in feedbackData) {
        const questionText = feedbackData[questionId].questionText;
        const response = feedbackData[questionId].response;

        feedbackArray.push({
            questionText,
            response,
        });
    }

    const stdout = execSync(`python sentimentAnalysis.py "${remarks}"`, { encoding: 'utf-8' });

    const sentimentLabel = stdout.trim();

    const feedbackDocument = new feedbackResponses({
        stationId,
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