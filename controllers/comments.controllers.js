const {
  selectCommentsForArticle,
  insertCommentForArticleId,
  deleteCommentById, 
  updateCommentByCommentId
} = require("../models/comments.models");
const { checkArticleExists } = require("../models/articles.models");

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    selectCommentsForArticle(article_id),
    checkArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentForArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  insertCommentForArticleId(article_id, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body
  updateCommentByCommentId(inc_votes, comment_id).then((comment) => {
    console.log({comment})
    res.status(200).send({ comment })
  })
  .catch((err) => {
    next(err);
  });
}

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id).then(() => {
    res.status(204).send()
  })
  .catch((err) => {
    next(err);
  });
}