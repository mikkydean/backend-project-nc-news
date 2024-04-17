const {
  selectArticleById,
  selectArticles,
  updateArticleVotes
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query
    selectArticles(topic).then((articles) => {
    res.status(200).send({ articles });
  })
    .catch((err) => {
    next(err);
  });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes).then((article) => {
    res.status(200).send({ article })
  })
  .catch((err) => {
    next(err);
  });
};
