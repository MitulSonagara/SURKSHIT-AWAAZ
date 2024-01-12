const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');

// router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
//     // This route is protected; only authenticated users can access it
//     res.render('dashboard'); // Render your dashboard template or perform other actions
// });

router.get('/viewHistory', (req, res) => {
    // This route is protected; only authenticated users can access it
    res.render('viewHistory'); // Render your dashboard template or perform other actions
});

module.exports = router;
