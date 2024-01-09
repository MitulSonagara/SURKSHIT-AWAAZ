const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const hbs = require("hbs");
require('dotenv').config()

const manageQuestionsRoute = require("./routes/manageQuestions")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));


app.set("view engine", "hbs");
app.set("views", "views");
hbs.registerPartials("views/partials");
hbs.registerHelper('eq', function (v1, v2) {
    return v1 === v2;
});

app.use("", manageQuestionsRoute)

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