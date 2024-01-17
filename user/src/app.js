const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("hbs");
const feedbackRoute = require("./routes/feedback")
require('dotenv').config()

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public")); 

// hbs engine
app.set("view engine", "hbs");
app.set("views", "views");
hbs.registerPartials("views/partials");

app.use("", feedbackRoute)

mongoose.connect(
    process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((e) => {
        console.log(e);
    })

const PORT = process.env.PORT || 4040

app.listen(PORT, () => {
    console.log("server started at http://localhost:4040");
})
