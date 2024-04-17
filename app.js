

const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getArticles,
  patchArticleVotes
} = require("./controllers/articles.controllers");
const { getApiEndpoints } = require("./controllers/api.controllers");
const {
  getCommentsForArticle,
  postCommentForArticleId,
  removeCommentById
} = require("./controllers/comments.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./errors/index.js')
const { getUsers } = require("./controllers/users.controllers.js")

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApiEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.get("/api/users", getUsers)

app.post("/api/articles/:article_id/comments", postCommentForArticleId);

app.patch("/api/articles/:article_id", patchArticleVotes)

app.delete("/api/comments/:comment_id", removeCommentById)

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
