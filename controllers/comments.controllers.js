const { selectCommentsForArticle } = require("../models/comments.models")
const { checkArticleExists } = require("../models/articles.models")

exports.getCommentsForArticle = (req, res, next) => {
    const { article_id } = req.params
    Promise.all([selectCommentsForArticle(article_id), checkArticleExists(article_id)])
    .then(([comments]) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err);
      });
}