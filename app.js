const express = require("express");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");
const apiRouter = require("./routes/api-router.js");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
