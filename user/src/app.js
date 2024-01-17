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

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        const PORT = process.env.PORT || 5000

        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
} 

startServer();

// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => { 
//     console.log("server started at http://localhost:5000");
// })
 