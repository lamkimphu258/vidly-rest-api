const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const Joi = require("joi");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true,
      min: [5, "Title length must greater than 5 characters"],
      max: [255, "Title legnth must lower than 255 characters"],
    },
    numberInStock: {
      type: Number,
      min: [0, "Number in stock cannot be lower than 0"],
      max: [255, "Number in stock cannot be greater than 255"],
      required: true,
    },
    dailyRentalRate: {
      type: Number,
      min: [0, "Daily rental rate cannot be lower than 0"],
      max: [255, "Daily rental rate cannot be greater than 255"],
      required: true,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
  })
);

const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(5).max(255).required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
    genreId: Joi.objectId().required(),
  });

  return schema.validate(movie);
};

exports.Movie = Movie;
exports.validate = validateMovie;
