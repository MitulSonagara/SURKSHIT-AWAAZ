const express = require('express');
const router = express.Router();
const passport = require('passport');
const uuid = require('uuid');
const Admin = require('../models/authorities');
const Stations = require("../models/stations")

// Signup Route
router.get('/createAuthority', async (req, res) => {
    try {
        const districts = await Stations.distinct('district');
        res.render('createAuthority', { districts });
    } catch (error) {
        console.error('Error fetching districts:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/stations', async (req, res) => {
    try {
        const district = req.query.district;
        const stations = await Stations.find({ district });
        res.json(stations);
    } catch (error) {
        console.error('Error fetching stations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

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
