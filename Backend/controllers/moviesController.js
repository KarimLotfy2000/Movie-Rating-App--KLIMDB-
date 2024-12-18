// moviesController.js
const { Op } = require("sequelize");
const {
  movies,
  ratings,
  users,
  actors,
  genres,
  sequelize,
} = require("../models");

const getAllMovies = async (req, res) => {
  const { genre, year, q, sortBy } = req.query;

  try {
    const filterOptions = {
      attributes: ["id", "name", "year", "image"],
      include: [],
      where: {},
      order: [],
    };

    if (q) {
      filterOptions.where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    if (genre) {
      const genreArray = genre.split(",").map((g) => g.trim());

      filterOptions.include.push({
        model: genres,
        as: "genres",
        where: { name: { [Op.in]: genreArray } },
        through: { attributes: [] },
        attributes: [],
      });
    }

    if (year) {
      filterOptions.where.year = year;
    }

    switch (sortBy) {
      case "name_asc":
        filterOptions.order.push(["name", "ASC"]);
        break;
      case "name_desc":
        filterOptions.order.push(["name", "DESC"]);
        break;
      case "year_asc":
        filterOptions.order.push(["year", "ASC"]);
        break;
      case "year_desc":
        filterOptions.order.push(["year", "DESC"]);
        break;
      default:
        break;
    }
    const allMovies = await movies.findAll(filterOptions);
    const response = {
      movies: allMovies,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching movies:", err.message);
    res
      .status(500)
      .json({ error: "An internal error occurred while fetching movies." });
  }
};

const getAllGenres = async (_, res) => {
  try {
    const allGenres = await genres.findAll({
      attributes: ["id", "name"],
    });
    res.json(allGenres);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getMovieDetails = async (movieId) => {
  try {
    const movieWithDetails = await movies.findOne({
      where: { id: movieId },
      include: [
        {
          model: actors,
          as: "actors",
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
        {
          model: genres,
          as: "genres",
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
      ],
    });

    if (!movieWithDetails) {
      throw new Error("Movie not found");
    }

    return movieWithDetails;
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
      ...movie.toJSON(),
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
  getAllGenres,
  getMovie,
  addMovie,
  addMultipleMovies,
  deleteMovie,
  addRating,
  deleteRating,
};
