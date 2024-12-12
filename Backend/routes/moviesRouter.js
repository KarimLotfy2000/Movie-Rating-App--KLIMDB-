// moviesRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovie,
  addMovie,
  addMultipleMovies,
  searchMovies,
  deleteMovie,
  addRating,
  deleteRating,
} = require("../controllers/moviesController");
const { verifyToken, verifyTokenAndAdmin } = require("../utils/verify");

// Get All Movies with limited attributes
router.get("/", getAllMovies);

// Search for a certain Movie
router.get("/search", searchMovies);

// Get a Certain Movie
router.get("/:id", getMovie);

// Add a Movie
router.post("/add", verifyTokenAndAdmin, addMovie);

// Add Multiple Movies
router.post("/add-multiple", verifyTokenAndAdmin, addMultipleMovies);

// Delete a Certain Movie
router.delete("/:id", verifyTokenAndAdmin, deleteMovie);

// Give a rating to a certain Movie
router.post("/:id/ratings", verifyToken, addRating);

// Delete Rating
router.delete("/:id/ratings", verifyTokenAndAdmin, deleteRating);

module.exports = router;
