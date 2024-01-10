const express = require('express');
const router = express.Router();
const FeedbackResponses = require("../models/feedbackResponses")
const moment = require('moment-timezone');
// const connectEnsureLogin = require('connect-ensure-login');

// router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {

//     // This route is protected; only authenticated users can access it
//     res.render('dashboard'); // Render your dashboard template or perform other actions

// });

router.get('/viewFeedbacks', async (req, res) => {

    let query = {};

    // Check if the search query is provided
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');

        query.$or = [
            { district: { $regex: searchRegex } },
            { policeStation: { $regex: searchRegex } },
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


    const feedbacks = await FeedbackResponses.find(query)

    // console.log(feedbacks)
    // This route is protected; only authenticated users can access it
    res.render('viewFeedbacks', { feedbacks }); // Render your dashboard template or perform other actions


});

module.exports = router;
