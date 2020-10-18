const express = require("express");
const { Genre, validate } = require("../models/genre");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Cannot found genre with given ID");

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newGenre = new Genre(req.body);
  await newGenre.save();

  res.send(newGenre);
});

router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("Cannot found genre with given ID");

  res.send(genre);
});

router.put("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updateGenre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateGenre)
    return res.status(404).send("Cannot found genre with given ID");

  res.send(updateGenre);
});

module.exports = router;
