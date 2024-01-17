const express = require("express")
const router = express.Router()
const FeedbackQuestion = require('../models/feedbackQuestions');
const feedbackResponses = require("../models/feedbackResponses2")
const stations = require("../models/stations")
const { execSync } = require('child_process');
const mongoose = require("mongoose");

const { Types } = mongoose;

router.get("/giveFeedback", async (req, res) => {
    try {
        const districts = await stations.distinct('district')

        const questions = await FeedbackQuestion.find()
        // console.log(questions)
        res.render('giveFeedback', { questions, districts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/stations', async (req, res) => {
    try {
        const district = req.query.district;
        const station = await stations.find({ district });
        res.json(station);
    } catch (error) {
        console.error('Error fetching stations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Example route for handling feedback submission
router.post('/giveFeedback', async (req, res) => {
    const feedbackData = req.body.questions;
    const { remarks } = req.body;
    const stationData = await stations.findOne({ name: req.body.station })
    // console.log(stationData)
    const id = stationData.stationId
    // console.log(id)

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
        stationId:id,
        feedback: feedbackArray,
        remarks,
        type: sentimentLabel,
    });

    // console.log(feedbackDocument)

    await feedbackDocument.save()
    res.send("thanks");
});

module.exports = router