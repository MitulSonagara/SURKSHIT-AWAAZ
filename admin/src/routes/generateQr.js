const express = require("express")
const router = express.Router()
const fs = require('fs');
const { execSync } = require('child_process');
const qr = require('qrcode');
const Station = require("../models/stations")

router.get("/generateQr", async (req, res) => {
    try {
        const districts = await Station.distinct('district')
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

router.post("/generateQr", async (req, res) => {
    const districtName = req.body.district
    const stationName = req.body.station
    const stationData = await Station.findOne({ "name": stationName })
    const stationId = stationData.id

    const url = 'https://www.google.com'

    qr.toDataURL(url, (err, url) => {
        if (err) throw err;

        // Convert the QR code image data to a buffer
        const imageData = Buffer.from(url.split(',')[1], 'base64');
        const img = imageData.toString('base64')

        try {
            execSync(`python generatePdf.py "${img}" "${districtName}" "${stationName}"`, { encoding: 'utf-8'});

            // res.render('downloadQrPdf');
        } catch (error) {
            console.error(`Error executing Python script: ${error.stderr || error.message}`);
            res.status(500).send('Internal Server Error');
        }
    });

})

module.exports = router