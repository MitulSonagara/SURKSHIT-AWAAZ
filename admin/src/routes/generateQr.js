const express = require("express")
const router = express.Router()
const Station = require("../models/stations")

router.get("/generateQr", async (req, res) => {
    try {
        const districts = await Station.distinct('district');
        res.render('generateQr', { districts });
    } catch (error) {
        console.error('Error fetching districts:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/stations', async (req, res) => {
    try {
        const district = req.query.district;
        const stations = await Station.find({ district });
        res.json(stations);
    } catch (error) {
        console.error('Error fetching stations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router