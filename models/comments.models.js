const db = require("../db/connection")

exports.selectCommentsForArticle = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;`, [article_id]).then(({ rows }) => {
        return rows
    })
}

exports.insertCommentForArticleId = (article_id, comment) => {
    const { username, body } = comment
    const inputArray = [article_id, body, username]
        return db.query(`INSERT INTO comments (article_id, body, author) VALUES ($1,$2,$3) RETURNING *;`, inputArray).then(({ rows }) => {
        console.log(rows)
        return rows[0]
    })
}