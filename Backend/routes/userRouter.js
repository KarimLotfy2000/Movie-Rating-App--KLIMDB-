const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../verify");

//REGISTER

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Registration Validation
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.message);

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      // if the email already exists
      if (results.length > 0)
        return res.status(400).json("User already exists");

      // Encrypting password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const sql =
        "INSERT INTO users (name,email,password,role) VALUES (?,?,?,'user') ";
      const values = [name, email, hashedPassword];
      db.query(sql, values, async (err, results) => {
        if (err) throw err;
        res.json("User registered successfully");
      });
    }
  );
});

//LOGIN

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.message);

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (results.length == 0) return res.status(400).json("Email not found");

      const validPass = await bcrypt.compare(password, results[0].password);
      if (!validPass) return res.status(400).json("Invalid Password");

      // Create and assign token
      const { password: Password, ...other } = results[0]; // To avoid sending the password
      const token = jwt.sign(
        { id: results[0].id, role: results[0].role },
        process.env.TOKEN_SECRET,
        { expiresIn: "1300m" }
      );

      res
        .header("Token", token)
        .cookie("Token", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .json({ ...other, token });
    }
  );
});

//LOGOUT

router.delete("/logout", (req, res) => {
  res.clearCookie("Token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).send("Logged out successfully");
});

//GET ALL USERS

router.get("/", verifyTokenAndAdmin, (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(400).json(err);
    res.json(results);
  });
});

//ADD TO FAVOURITES

router.post("/:id/favourites", verifyToken, (req, res) => {
  const user_id = req.params.id;
  const movie_id = req.body.movie_id;

  const sql = `
    INSERT INTO favourites (user_id, movie_id)
    VALUES (?, ?);
  `;
  db.query(sql, [user_id, movie_id], (err, results) => {
    if (err) {
      // Check if the error is due to duplicate entry
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json(err);
      }
      return res.status(500).json({
        error: "An error occurred while adding the movie to favorites",
      });
    }
    res.json("Movie Added Successfully to favorites");
  });
});

//GET YOUR FAVOURITES

router.get("/:id/favourites", verifyTokenAndAuthorization, (req, res) => {
  const sql = `
              SELECT m.id, m.name, m.year, m.description, m.image
              FROM movies m
              JOIN favourites f ON m.id = f.movie_id
              WHERE f.user_id = ?;
  
            `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) res.status(404).json(err);
    res.json(results);
  });
});

//REMOVE FROM FAVOURITES

router.delete(
  "/:id/favourites/:movie_id",
  verifyTokenAndAuthorization,
  (req, res) => {
    const movie_id = req.params.movie_id;
    const user_id = req.params.id;

    const sql = `
               DELETE FROM favourites 
               WHERE user_id=? AND movie_id=?
  
            `;
    db.query(sql, [user_id, movie_id], (err, results) => {
      if (err) res.status(404).json(err);
      res.json("Movie removed from Favourites");
    });
  }
);

module.exports = router;
