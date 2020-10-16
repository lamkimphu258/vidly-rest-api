const mongoose = require('mongoose');
const Joi = require("joi");

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      min: [5, "Name must have length greater than 5"],
      max: [50, "Name length over 50 characters"],
      required: true,
    },
  })
);

const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
};

exports.Genre = Genre;
exports.validate = validateGenre;
