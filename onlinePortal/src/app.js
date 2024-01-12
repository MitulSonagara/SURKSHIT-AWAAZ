const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

const indexRoute = require('./routes/index');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const dashboardRoute = require('./routes/dashboard');
const giveFeedbackRoute = require('./routes/giveFeedback');
const viewHistoryRoute = require('./routes/viewHistory');
const checkResponseRoute = require('./routes/checkResponse');
const User = require('./models/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.use(
    session({
        secret: 'my-secreysfa-mjiadfsn',
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'hbs');
app.set('views', 'views');
hbs.registerPartials('views/partials');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('', indexRoute);
app.use('', signupRoute);
app.use('', loginRoute);
app.use('', dashboardRoute);
app.use('', viewHistoryRoute);
app.use('', giveFeedbackRoute);
app.use('', checkResponseRoute);

mongoose.connect(
    process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((e) => {
        console.log(e);
    })
app.listen(3030, () => {
    console.log('Server started on port http://localhost:3030');
});
