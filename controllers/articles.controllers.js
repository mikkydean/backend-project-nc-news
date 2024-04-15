const { selectArticleById, selectArticleIdByCount, selectArticles } = require("../models/articles.models");

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
  let articleCommentCount 
  selectArticleIdByCount().then((body) => {
    articleCommentCount = body
  }).then(() => {
    selectArticles().then((articles) => {
      for (let i=0; i<articles.length; i++) {
        for (let j=0; j<articleCommentCount.length; j++) {
        delete articles[i].body
        if (articles[i].article_id === articleCommentCount[j].article_id) {
          articles[i].comment_count = Number(articleCommentCount[j].count)
        }
        if (!articles[i].comment_count) {
          articles[i].comment_count = 0
        }
      }   
    }   
  res.status(200).send({articles})
  })
})
}

