// moviesController.js
const { movies, ratings, users, sequelize } = require("../models");

const getAllMovies = async (_, res) => {
  try {
    const allMovies = await movies.findAll({
      attributes: ["id", "name", "year", "genre", "image"],
    });
    res.json(allMovies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMovieDetails = async (movieId) => {
  try {
    const movie = await movies.findByPk(movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }
    movie.actors = movie.actors.split("\r\n");
    return movie;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    throw new Error("Internal Server Error");
  }
};

const getAverageRating = async (movieId) => {
  try {
    const avgResult = await ratings.findOne({
      attributes: [
        [
          sequelize.fn(
            "ROUND",
            sequelize.fn("AVG", sequelize.col("rating")),
            1
          ),
          "average",
        ],
      ],
      where: { movie_id: movieId },
      raw: true,
    });
    return avgResult.average ?? 1;
  } catch (error) {
    console.error("Error fetching Average:", error);
    throw new Error("Internal Server Error");
  }
};

const getReviews = async (movieId) => {
  try {
    const reviews = await ratings.findAll({
      attributes: ["review"],
      include: [
        {
          model: users,
          as: "user",
          attributes: ["name"],
        },
      ],
      where: { movie_id: movieId },
      group: ["user.name"],
    });
    return reviews.map((review) => ({
      name: review.user.name,
      review: review.review,
    }));
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    throw new Error("Internal Server Error");
  }
};

const getMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await getMovieDetails(movieId);
    const avgRating = await getAverageRating(movieId);
    const reviews = await getReviews(movieId);

    const response = {
      id: movie.id,
      title: movie.title,
      genre: movie.genre,
      image: movie.image,
      trailer: movie.trailer,
      description: movie.description,
      actors: movie.actors,
      average_rating: avgRating,
      reviews: reviews,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching movie data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addMovie = async (req, res) => {
  const { name, year, description, image, genre, trailer, actors } = req.body;
  try {
    const newMovie = await movies.create({
      name,
      year,
      description,
      image,
      genre,
      trailer,
      actors,
    });
    res.json(newMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addMultipleMovies = async (req, res) => {
  const moviesArray = req.body.movies;
  if (!Array.isArray(moviesArray)) {
    return res
      .status(400)
      .json({ error: "Invalid input. An array of movies is required." });
  }
  try {
    await movies.bulkCreate(moviesArray);
    res.json("Movies added successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    await movies.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchMovies = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    const results = await movies.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { actors: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
          { genre: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
    });

    res.json(results);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).json({ error: "An error occurred while searching movies" });
  }
};

const addRating = async (req, res) => {
  const movie_id = req.params.id;
  const { rating, review } = req.body;
  const user_id = req.user.id;

  try {
    const ratingExist = await ratings.findOne({
      where: {
        user_id: user_id,
        movie_id: movie_id,
      },
      raw: true,
    });
    if (ratingExist) {
      return res
        .status(400)
        .json({ error: "You have already rated this movie" });
    }
    const newRating = await ratings.create({
      user_id,
      movie_id,
      rating,
      review,
    });
    res.json({ message: "Movie Rated Successfully", data: newRating });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteRating = async (req, res) => {
  try {
    await ratings.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovie,
  addMovie,
  addMultipleMovies,
  searchMovies,
  deleteMovie,
  addRating,
  deleteRating,
};
