const express = require('express');
const router = express.Router();
const FeedbackResponses = require("../models/feedbackResponses");

router.get("/viewgraphs", async (req, res) => {
    try {
        const result = await FeedbackResponses.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id",
                    count: 1,
                }
            },
            {
                $sort: {
                    type: 1, // Sort by type in ascending order
                }
            }
        ]);

        // Calculate the total count
        const totalCount = result.reduce((acc, cur) => acc + cur.count, 0);

        // Calculate the percentages and create the array
        const percentages = result.map(item => (item.count / totalCount) * 100);

        res.render("viewGraphs",{percentages});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
