const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getArticleById, getArticles } = require("./controllers/articles.controllers")
const { getApiEndpoints } = require("./controllers/api.controllers")
const { getCommentsForArticle } = require("./controllers/comments.controllers")


const app = express()

app.get("/api/topics", getTopics);

app.get("/api", getApiEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsForArticle)

app.all("*", (req, res, next) => {
    res.status(404).send({ message: "Endpoint not found"})
})

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message })
    }
    next(err)
}) 

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ message: "Invalid request"})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({ message: "Internal server error"})
})

module.exports = app