const express = require("express");
const router = express.Router();
const feedbackResponses = require("../models/feedbackResponses");
const stations = require("../models/stations");

router.get("/viewOnMap", async (req, res) => {
    try {
        const positiveFeedbacks = await feedbackResponses.aggregate([
            {
                $match: {
                    type: 'Positive Feedback', // Adjust based on your actual values
                },
            },
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
                $project: {
                    _id: 0,
                    coordinates: ['$stationData.latitude', '$stationData.longitude'],
                },
            },
        ]);

        // Extracting coordinates array from the result
        const coordinatesArray = positiveFeedbacks.map(item => item.coordinates);
        const coordinatesArrayString = JSON.stringify(coordinatesArray);

        res.render("heatmap", { coordinatesArrayString })
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
