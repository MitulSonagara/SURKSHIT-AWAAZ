const express = require("express");
const hbs = require("hbs")
const routes = express.Router();

routes.get("/", (req, res) => {
    res.render("index")
})

routes.get("/signup", (req, res) => {
    res.render("signup")
})

routes.get("/login", (req, res) => {
    res.render("login")
})

module.exports = routes;