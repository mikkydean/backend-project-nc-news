const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  patchArticleVotes,
} = require("../controllers/articles.controllers");
const {
  getCommentsForArticle,
  postCommentForArticleId,
} = require("../controllers/comments.controllers");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsForArticle)
    .post(postCommentForArticleId)

articlesRouter.patch("/:article_id", patchArticleVotes);

module.exports = articlesRouter;
