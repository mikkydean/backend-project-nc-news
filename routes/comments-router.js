const commentsRouter = require("express").Router();
const { removeCommentById } = require("../controllers/comments.controllers");

commentsRouter.delete("/:comment_id", removeCommentById);

module.exports = commentsRouter;
