const { ValidationError, ForeignKeyConstraintError } = require("sequelize");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.json(err);
  }
  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      message:
        "Foreign key constraint error - a foreign key provided does not exist in the database",
    });
  }
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: err.message });
  }
  res.sendStatus(500);
};

module.exports = errorHandler;
