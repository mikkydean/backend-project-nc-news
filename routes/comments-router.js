const commentsRouter = require("express").Router();
const { removeCommentById, patchCommentByCommentId } = require("../controllers/comments.controllers");

commentsRouter
.route("/:comment_id")
.patch(patchCommentByCommentId)
.delete(removeCommentById);

module.exports = commentsRouter;
