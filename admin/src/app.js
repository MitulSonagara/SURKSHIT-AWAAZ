const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const hbs = require("hbs");
require('dotenv').config()

const manageQuestionsRoute = require("./routes/manageQuestions")
const dashboardRoute = require("./routes/dashboard")
const createAuthorityRoute = require("./routes/createAuthority")
const viewFeedbacksRoute = require("./routes/viewFeedbacks")
const loginRoute = require("./routes/login")
const Admin = require("./models/authorities")
const generateQrRoute = require("./routes/generateQr")
const viewGraphsRoute = require("./routes/viewGraphs")
const heatmapRoute = require("./routes/heatmap")
const surveyRoute = require("./routes/createSurvey")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));


app.use(
    session({
        secret: 'my-secreysfa-mjiadfsn',
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "hbs");
app.set("views", "views");
hbs.registerPartials("views/partials");
hbs.registerHelper('eq', function (v1, v2) {
    return v1 === v2;
});
hbs.registerHelper('gt', function (v1, v2) {
    return v1 > v2;
});
hbs.registerHelper('add', function (v1, v2) {
    return v1 + v2;
});
hbs.registerHelper('subtract', function (v1, v2) {
    return v1 - v2;
});
hbs.registerHelper('lt', function (v1, v2) {
    return v1 < v2;
});
hbs.registerHelper('range', function (start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
});
hbs.registerHelper('eachPair', function (array1, array2, options) {
    if (!array1 || !array2 || array1.length !== array2.length) {
        return options.inverse(this);
    }

    let result = '';
    for (let i = 0; i < array1.length; i++) {
        result += options.fn({ value1: array1[i], value2: array2[i], index: i });
    }

    return result;
});
hbs.registerHelper('max', function (a, b) {
    return Math.max(a, b);
});
hbs.registerHelper('min', function (a, b) {
    return Math.min(a, b);
});
hbs.registerHelper('multiply', function (a, b) {
    return Number(a) * Number(b);
});

passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use("", manageQuestionsRoute)
app.use("", createAuthorityRoute)
app.use('', dashboardRoute)
app.use("", loginRoute)
app.use("", viewFeedbacksRoute)
app.use("", generateQrRoute)
app.use("", viewGraphsRoute)
app.use("", heatmapRoute)
app.use("", surveyRoute)

mongoose.connect( 
    process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    }) 
    .catch((e) => {
        console.log(e);
    })

app.listen(2000, () => {
    console.log("Server started on port http://localhost:2000")
})