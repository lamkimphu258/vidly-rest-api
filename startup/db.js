const mongoose = require("mongoose");
const config = require("config");
const winston = require("../config/winston");

module.exports = () => {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    })
    .then(() => winston.log("info", `Connected to ${config.get("db")}`))
    .catch((err) => winston.error("error", "Cannot connect to database"));
};
