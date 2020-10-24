const express = require("express");
const router = express.Router();

const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Invalid genre");

  const newMovie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await newMovie.save();

  res.send(newMovie);
});

router.get("/", async (req, res) => {
  const movies = await Movie.find();

  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie with given ID not found.");

  res.send(movie);
});

module.exports = router;
