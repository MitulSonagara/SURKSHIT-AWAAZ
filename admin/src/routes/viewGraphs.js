const express = require('express');
const router = express.Router();
const FeedbackResponses = require("../models/feedbackResponses");
const FeedbackQuestion = require("../models/feedbackQuestion")

async function generateResponseCountsFromDB() {
    try {
        const feedbackResponses = await FeedbackResponses.find({});
        const result = [];

        const responseCounts = {};

        feedbackResponses.forEach((entry) => {
            entry.feedback.forEach((question) => {
                const questionKey = question.questionText || 'unknown';

                // Initialize counts for the question if not done yet
                if (!responseCounts[questionKey]) {
                    responseCounts[questionKey] = {};
                }

                const response = question.response;

                // Increment the count for the response and question
                responseCounts[questionKey][response] = (responseCounts[questionKey][response] || 0) + 1;
            });
        });

        // Convert the responseCounts object to an array of arrays
        for (const [question, counts] of Object.entries(responseCounts)) {
            const countArray = Object.values(counts);
            result.push(countArray);
        }
        return result;
    } catch (error) {
        console.error("Error fetching data from the database:", error);
        throw new Error("Error fetching data from the database");
    }
}


router.get("/viewgraphs", async (req, res) => {
    try {

        const questionData = await FeedbackQuestion.find()
        console.log(questionData)
 

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

        generateResponseCountsFromDB()
            .then((responseCountsArray) => {
                if (responseCountsArray !== null) {
                    const allCountArrays = responseCountsArray;

                    const resultArray = allCountArrays.map((countArray, index) => {
                        const question = questionData[index];
                        return {
                            questionText: "visitors",
                            options: `[${question.options.map(option => `"${option}"`).join(',')}]`, 
                            count: countArray
                        };
                    });

                    console.log("All Count Arrays:", resultArray);
                    res.render("viewGraphs", { percentages , resultArray});

                    // return allCountArrays
                }
            });

        // res.render("viewGraphs", { percentages });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
