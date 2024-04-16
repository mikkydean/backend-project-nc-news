

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid request: ID has incorrect format" });
  } else if (err.code === "23502") {
    res.status(400).send({ message: "Invalid request: Object has incorrect properties" });
  }
  next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
};