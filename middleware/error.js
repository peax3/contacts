const printError = require("../utils/printError");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  printError({ err });
  printError({ error });

  res.status(error.statusCode || 500).json({
    message: error.message || "Server error",
  });
};

module.exports = errorHandler;
