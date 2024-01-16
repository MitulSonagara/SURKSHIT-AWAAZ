const express = require('express');
const feedbackResponses = require("../models/feedbackResponses")
const router = express.Router();
// const connectEnsureLogin = require('connect-ensure-login');

// router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {

//     // This route is protected; only authenticated users can access it
//     res.render('dashboard'); // Render your dashboard template or perform other actions

// });

router.get('/dashboard',async (req, res) => {
    // This route is protected; only authenticated users can access it 
    const total = await feedbackResponses.countDocuments()
    const positive = await feedbackResponses.countDocuments({ type: "Positive Feedback" })
    const negative = await feedbackResponses.countDocuments({ type: "Negative Feedback" }) 


    res.render('dashboard', { total, positive ,negative}); // Render your dashboard template or perform other actions


});

module.exports = router;
