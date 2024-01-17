const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const feedbackResponses = require("../models/feedbackResponses2")
const FeedbackQuestion = require("../models/feedbackQuestions")

const stations = require("../models/stations")


// router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
//     // This route is protected; only authenticated users can access it
//     res.render('dashboard'); // Render your dashboard template or perform other actions
// });

router.get('/viewHistory', async (req, res) => {
    try {
        const questions = await FeedbackQuestion.find();
        const currentPage = parseInt(req.query.page) || 1;
        const perPage = 10; // Adjust this value based on your preference
        const skip = (currentPage - 1) * perPage;

        const totalFeedbacks = await feedbackResponses.countDocuments();
        const totalPages = Math.ceil(totalFeedbacks / perPage);

        const data = await feedbackResponses.aggregate([
            {
                $lookup: {
                    from: 'stations',
                    localField: 'stationId',
                    foreignField: 'stationId', // Assuming stationId in stations is stored as _id
                    as: 'stationData',
                },
            },
            {
                $unwind: '$stationData',
            },
            {
                $skip: skip,
            },
            {
                $limit: perPage,
            },
            {
                $project: {
                    _id: 0,
                    feedback: 1,
                    district: '$stationData.district',
                    stationName: '$stationData.name',
                    remarks: 1,
                    date: 1,
                },
            },
        ]);

        console.log(data)

        res.render('viewHistory', { questions,data, totalFeedbacks, currentPage, totalPages, "cPage": currentPage });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;
