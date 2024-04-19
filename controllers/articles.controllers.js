const {
  selectArticleById,
  selectArticles,
  updateArticleVotes,
  insertArticle,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

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
  const { topic, sort_by, order, p, length } = req.query;
    Promise.all([
      selectArticles(topic, sort_by, order, p, length),
      checkTopicExists(topic),
    ])
    .then((returnedArticles) => {
      const articles = returnedArticles[0];
      let total_count = 0
      if (articles.length !== 0) {
        total_count = Number(articles[0].total_count)
        articles.forEach((article) => {
          delete article.total_count
        })
      }
      res.status(200).send({ articles, total_count });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic } = req.body;
  insertArticle(author, title, body, topic)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
