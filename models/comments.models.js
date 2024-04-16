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
        return rows[0]
    })
}

exports.deleteCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [comment_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Comment ID not found" })
        }
    })
}