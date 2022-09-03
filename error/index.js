const { ValidationError } = require("sequelize");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.json(err);
  }
  res.sendStatus(500);
};

module.exports = errorHandler;
