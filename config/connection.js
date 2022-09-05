require("dotenv").config();

const Sequelize = require("sequelize");

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: "127.0.0.1",
      dialect: "mysql",
      dialectOptions: {
        decimalNumbers: true,
      },
    });

(async () => {
  try {
    const { connect } = await sequelize.query("select 1 + 1 as connect;", { plain: true });
    console.log(
      connect === 2 ? "Successfully connected to database!" : "Failed to connect database"
    );
  } catch (error) {
    console.log("Failed to connect database", error);
  }
})();

module.exports = sequelize;
