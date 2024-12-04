const express = require("express");
const router = express.Router();
const connection = require("../config/db");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../verify");
const { ratingValidation } = require("../validation");

//Get All Movies

router.get("/", (req, res) => {
  const sql = "SELECT * FROM movies";
  connection.query(sql, (err, results) => {
    if (err) return err;
    if (results.length == 0)
      return res.status(400).json("No Movies in the database");
    res.json(results);
  });
});

//Get a Certain Movie

router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM movies WHERE id=?";
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) return err;
    if (results.length === 0)
      return res
        .status(400)
        .json("This particular movie is not in the database");

    const actorsArray = results[0].actors.split("\r\n");
    results[0].actors = actorsArray;

    res.json(results);
  });
});
//Add a Movie

router.post("/add", verifyTokenAndAdmin, (req, res) => {
  const { name, year, description, image, genre, trailer, actors } = req.body;
  const sql =
    "INSERT INTO movies (name, year, description, genre, image,trailer,actors) VALUES (?,?,?,?,?,?,?)";
  const values = [name, year, description, genre, image, trailer, actors];
  connection.query(sql, values, (err) => {
    if (err) return res.status(400).json(err);
    res.json("Movie added to database");
  });
});

//Delete a Certain Movie

router.delete("/:id", verifyTokenAndAdmin, (req, res) => {
  const sql = "DELETE FROM movies WHERE id=?";
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(400).json(err);
    res.json("Movie Deleted Successfully");
  });
});

//Give a rating to a certain Movie

router.post("/:id/ratings", verifyToken, (req, res) => {
  const movie_id = req.params.id;
  const { user_id, rating, review } = req.body;
  const { error } = ratingValidation(req.body);

  if (error) {
    return res.status(400).json(error.message);
  }

  // Check if the user has already rated the movie
  const checkSql = "SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?";
  const checkValues = [user_id, movie_id];
  connection.query(checkSql, checkValues, (checkErr, results) => {
    if (checkErr) {
      console.error("Error while checking for existing rating:", checkErr);
      return res.status(500).json("Internal Server Error");
    }

    if (results.length > 0) {
      return res.status(400).json("You have already rated this movie");
    }
    // Insert the new rating
    const insertSql =
      "INSERT INTO ratings (user_id, movie_id, rating, review) VALUES (?,?,?,?)";
    const insertValues = [user_id, movie_id, rating, review];
    connection.query(insertSql, insertValues, (insertErr) => {
      if (insertErr) {
        console.error("Error while inserting rating:", insertErr);
        return res.status(500).json("Internal Server Error");
      }
      res.json("Movie Rated Successfully");
    });
  });
});

//Delete  Rating

router.delete("/:id/ratings", verifyTokenAndAdmin, (req, res) => {
  const movie_id = req.params.id;
  const sql = "DELETE FROM ratings WHERE movie_id=?";
  connection.query(sql, [movie_id], (err) => {
    if (err) return err;
    res.json("Movie Rating Deleted Successfully");
  });
});

//Get average Rating of a Movie

router.get("/:id/avg", verifyToken, (req, res) => {
  const sql = `SELECT ROUND(AVG(rating), 2) AS avg_rating
               FROM ratings 
               WHERE movie_id = ?`;
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(400).json(err);
    if (results[0].avg_rating == null) {
      results[0].avg_rating = 1;
      res.json(results);
    } else {
      res.json(results);
    }
  });
});

//Get all reviews of a film with the owners' names

router.get("/:id/reviews", verifyToken, (req, res) => {
  const sql = `
    SELECT u.name, r.review  
    FROM ratings r
    JOIN users u ON u.id = r.user_id 
    WHERE r.movie_id =?
    GROUP BY u.name`;
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(400).json(err);
    res.json(results);
  });
});

module.exports = router;
