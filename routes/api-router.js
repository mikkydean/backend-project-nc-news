const apiRouter = require("express").Router();
const { getApiEndpoints } = require("../controllers/api.controllers");
const userRouter = require("./users-router.js");
const topicsRouter = require("./topics-router.js");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");

apiRouter.get("/", getApiEndpoints);

apiRouter.use("/users", userRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
