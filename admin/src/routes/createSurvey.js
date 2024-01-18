const express = require("express")
const router = express.Router();
const Survey = require("../models/survey")
const Response = require("../models/surveyResponses")
const nodemailer = require('nodemailer');


router.get("/surveyForm/:id", async (req, res) => {
    try {
        const surveyId = req.params.id;

        // Find the survey by its ID
        const survey = await Survey.findById(surveyId);

        if (!survey) {
            return res.status(404).send('Survey not found');
        }

        // Render the survey form view with the survey data
        res.render('surveyForm', { survey });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/submit/:id', async (req, res) => {
    try {
        const surveyId = req.params.id;
        const { answers } = req.body;

        // Find the survey by its ID
        const survey = await Survey.findById(surveyId);

        if (!survey) {
            return res.status(404).send('Survey not found');
        }

        // Create a new response document
        const response = new Response({
            survey: surveyId,
            answers: answers.map((answer, index) => ({ question: survey.questions[index], answer })),
        });

        // Save the response
        await response.save();

        res.status(200).send('Survey response submitted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/createSurvey", async (req, res) => {
    res.render("createSurvey")
})

router.post('/createSurvey', async (req, res) => {
    const { title, questions } = req.body;

    // Create a new survey
    const newSurvey = new Survey({ title, questions: questions.split('\n') });
    await newSurvey.save();

    const transporter = nodemailer.createTransport({
        // Configure your email provider (SMTP details)
        service: 'gmail',
        auth: {
            user: 'maherakirti@gmail.com',
            pass: 'jfwjuzwfrdwiaauv',
        },
    });

    const surveyLink = `http://localhost:2000/surveyForm/${newSurvey._id}`;

    const mailOptions = {
        from: 'maherakirti@gmail.com',
        to: 'mitulkumarsongara@gmail.com',
        subject: 'Survey Invitation',
        html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <!-- ... (head content) ... -->
            </head>
            <body>
              <h1>Survey Invitation</h1>
              <p>You have been invited to participate in a survey. Click the link below to fill it out:</p>
              <a href="${surveyLink}">${surveyLink}</a>
            </body>
            </html>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.redirect('/create?error=true');
        }

        console.log('Email sent: ' + info.response);
        res.redirect('/survey');
    });
    // res.redirect('/survey'); // Redirect to the question management page
});


router.get('/survey', async (req, res) => {
    try {
        // Fetch all surveys
        const surveys = await Survey.find();

        // Render the dashboard view with the list of surveys
        res.render('survey', { surveys });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/survey/:id', async (req, res) => {
    try {
        const surveyId = req.params.id;

        const survey = await Survey.findById(surveyId);

        if (!survey) {
            return res.status(404).send('Survey not found');
        }

        // Fetch responses associated with the survey
        const responses = await Response.find({ survey: surveyId });

        // Render the survey details view with the combined data
        res.render('surveyDetails', { responses ,survey});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;