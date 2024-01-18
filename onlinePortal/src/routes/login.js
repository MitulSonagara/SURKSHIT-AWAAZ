const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/giveFeedback',
    }),
    (req, res) => {
        console.log(req.user);
    }
);


module.exports = router;
