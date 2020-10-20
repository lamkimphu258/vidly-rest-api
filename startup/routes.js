const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const returns = require("../routes/returns");
const authentication = require("../routes/auth");
const {
  logErrors,
  clientErrorHandler,
  errorHandler,
} = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());

  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/authentication", authentication);
  app.use("/api/returns", returns);

  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);
};
