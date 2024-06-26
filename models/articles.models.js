const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT articles.article_id, title, topic, articles.body, articles.author, articles.created_at::timestamp, articles.votes, article_img_url,
    CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles 
    LEFT OUTER JOIN comments ON articles.article_id=comments.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id ORDER BY articles.created_at DESC
    ;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return rows[0];
    });
};

exports.selectArticleIdByCount = () => {
  return db
    .query(`SELECT article_id, COUNT(*) FROM comments GROUP By article_id;`)
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticles = (topic, sort_by="created_at", order="DESC", p, length=10) => {
  const queryValue = [];
  const validSortBys = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"]
  const validOrders = ["asc", "desc", "ASC", "DESC"]
  const offset = ((p-1)*length)+1

  if (!validSortBys.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid query value" })
  }

  let sqlQueryString = `SELECT articles.article_id, title, topic, articles.author, articles.created_at::timestamp, articles.votes, article_img_url,
      CAST(COUNT(comment_id) AS INT) AS comment_count, count(*) OVER() AS total_count
      FROM articles 
      LEFT OUTER JOIN comments ON articles.article_id=comments.article_id `;
  if (topic) {
    queryValue.push(topic);
    sqlQueryString += `WHERE topic=$1 `;
  }
  sqlQueryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}
                     LIMIT ${length} `;

  if (p) {
    sqlQueryString += `OFFSET ${offset}`
  }

  return db.query(sqlQueryString, queryValue).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article ID not found" });
      }
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const updateArray = [article_id, inc_votes];
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`,
      updateArray
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article ID not found" });
      }
      return rows[0];
    });
};

exports.insertArticle = (author, title, body, topic) => {
  const updateArray = [author, title, body, topic]
  return db.query(`INSERT INTO articles (author, title, body, topic) VALUES ($1,$2,$3,$4) RETURNING *;`, updateArray)
  .then(({rows}) => {
    const article_id = rows[0].article_id
    return db
    .query(`SELECT articles.article_id, title, topic, articles.body, articles.author, articles.created_at::timestamp, articles.votes, article_img_url,
    CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles 
    LEFT OUTER JOIN comments ON articles.article_id=comments.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id ORDER BY articles.created_at DESC
    ;`, [article_id])
  })
  .then(({rows}) => {
    return rows[0]
  })
}