const express = require('express');
const router = express.Router();
const passport = require('passport');
const uuid = require('uuid');
const Admin = require('../models/authorities');
const Stations = require("../models/stations")

// Signup Route
router.get('/createAuthority', async (req, res) => {
    const stations =await Stations.find({})
    res.render('createAuthority',{stations});
});

router.post('/createAuthority', async (req, res, next) => {
    try {
        // Check if the email is already in use
        const existingAdmin = await Admin.findOne({ email: req.body.email });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        // Create a new Admin
        const newAdmin = new Admin({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.number,
            district: req.body.district,
            policeStation: req.body.policeStation,
            post: req.body.post
        });

        Admin.register(newAdmin, req.body.password, (err) => {
            if (err) {
                // Handle registration error
                return next(err);
            }
            // Registration successful, redirect to login page
            res.redirect(`/dashboard`);

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
