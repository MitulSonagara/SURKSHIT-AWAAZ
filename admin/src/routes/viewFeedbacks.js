const express = require('express');
const router = express.Router();
const FeedbackResponses = require("../models/feedbackResponses")
const FeedbackQuestion = require('../models/feedbackQuestion');
const stations = require("../models/stations")
const moment = require('moment-timezone');
// const connectEnsureLogin = require('connect-ensure-login');

// router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {

//     // This route is protected; only authenticated users can access it
//     res.render('dashboard'); // Render your dashboard template or perform other actions

// });

router.get('/viewFeedbacks', async (req, res) => {
    const questions = await FeedbackQuestion.find();

    // Pagination setup
    const currentPage = parseInt(req.query.page) || 1;
    const perPage = 1; // Adjust this value based on your preference
    const skip = (currentPage - 1) * perPage;

    let query = {};

    // ... (existing query logic)
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');

        query.$or = [
            { "stationData.district": { $regex: searchRegex } },
            { "stationData.name": { $regex: searchRegex } },
        ];
    }

    // Check if both start and end dates are provided
    if (req.query.startDate && req.query.endDate) {
        const startDateTime = moment(req.query.startDate).tz('Asia/Kolkata').startOf('day');
        const endDateTime = moment(req.query.endDate).tz('Asia/Kolkata').endOf('day');

        query.date = {
            $gte: startDateTime.format('DD-MM-YYYY'),
            $lte: endDateTime.format('DD-MM-YYYY'),
        };
    } else {
        // Check if only start date is provided
        if (req.query.startDate) {
            const startDateTime = moment(req.query.startDate).tz('Asia/Kolkata').startOf('day');
            query.date = { $gte: startDateTime.format('DD-MM-YYYY') };
        }

        // Check if only end date is provided
        if (req.query.endDate) {
            const endDateTime = moment(req.query.endDate).tz('Asia/Kolkata').endOf('day');
            query.date = { $lte: endDateTime.format('DD-MM-YYYY') };
        }
    }

    const totalFeedbacks = await FeedbackResponses.countDocuments(query);
    const totalPages = Math.ceil(totalFeedbacks / perPage);

    const feedbacks = await FeedbackResponses.aggregate([
        {
            $lookup: {
                from: 'stations',
                localField: 'stationId',
                foreignField: '_id',
                as: 'stationData',
            },
        },
        {
            $unwind: '$stationData',
        },
        {
            $match: query,
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
                // Add other fields you want to include in the result
                feedback: 1,
                district: '$stationData.district',
                policeStation: '$stationData.name',
                remarks: 1,
                date: 1,
            },
        },
    ]);

    res.render('viewFeedbacks', { feedbacks, questions, currentPage, totalPages,"cPage":currentPage });
});

module.exports = router;
