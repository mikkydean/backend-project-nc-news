const express = require("express")
const { getTopics } = require("./controllers/app.controllers")

const app = express()


app.get("/api/topics", getTopics);



app.all("*", (req, res, next) => {
    res.status(404).send({ message: "Endpoint not found"})
})

/// other errors go here

app.use((err, req, res, next) => {
    res.status(500).send({ message: "Internal server error"})
})

module.exports = app