const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id]).then(({ rows }) => {
        if ( rows.length === 0 ) {
            return Promise.reject({ status: 404, message: "Not found"})
        }
        return rows[0]
    })
}

exports.selectArticleIdByCount = () => {
    return db.query(`SELECT article_id, COUNT(*) FROM comments GROUP By article_id;`).then(({ rows }) => {
        return rows
    })
}

exports.selectArticles = () => {
    return db.query(`SELECT * FROM articles ORDER BY created_at DESC`).then(({ rows }) => {
       return rows
    })
}