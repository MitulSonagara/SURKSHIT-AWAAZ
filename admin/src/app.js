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

passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use("", manageQuestionsRoute)
app.use("", createAuthorityRoute)
app.use('', dashboardRoute)
app.use("", loginRoute)
app.use("", viewFeedbacksRoute)

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