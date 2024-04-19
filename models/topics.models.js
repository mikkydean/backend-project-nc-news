const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (topic) => {
    if (!topic) {
        return Promise.resolve
    }
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
        console.log(rows)
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Topic not found" });
      }
      else {
        return rows
      }
    });
};
