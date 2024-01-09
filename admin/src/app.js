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

//DataBase Connection
const username = process.env.USERNAME
const password = encodeURIComponent(process.env.PASSWORD)

// main().catch((err) => console.log(err));

// async function main() {
//     await mongoose.connect(`mongodb+srv://${username}:${password}@clustor0.rorvcgj.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log("Database connected");
// }

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