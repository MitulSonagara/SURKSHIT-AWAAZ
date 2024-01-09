const express = require("express")
const routes = express.Router();
const FeedbackQuestion = require("../models/feedbackQuestion")
const uuid = require('uuid');

routes.get("/manageQuestions", async (req, res) => {
    const questions = await FeedbackQuestion.find();
    res.render("manageQuestions", { questions });
})

routes.get("/manageQuestions/addQuestion", async (req, res) => {
    res.render("addQuestion")
})

routes.post('/manageQuestions/addQuestion', async (req, res) => {
    const uniqueId = uuid.v4();

    const { questionText, questionType, options } = req.body;

    const newQuestion = new FeedbackQuestion({
        questionId: uniqueId,
        questionText,
        questionType,
        options: questionType === 'multiple-choice' ? options.split(',') : [], // Split options if applicable
    });

    await newQuestion.save();
    res.redirect('/manageQuestions'); // Redirect to the question management page
});

routes.get("/manageQuestions/deleteQuestion", async (req, res) => {
    const questions = await FeedbackQuestion.find();
    res.render("deleteQuestion", { questions });
})

routes.post('/manageQuestions/deleteQuestion', async (req, res) => {
    const questionId = req.body.questionId;
    await FeedbackQuestion.findByIdAndRemove(questionId);
    res.redirect('/manageQuestions'); // Redirect to the question management page
});

module.exports = routes;