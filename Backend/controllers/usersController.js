//usersController.js
const { movies, users, favourites } = require("../models");
const { registerValidation, loginValidation } = require("../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send({ error: error.message });

  const isEmailRegistered = await users.findOne({ where: { email } });
  if (isEmailRegistered)
    return res.status(400).json({ error: "User already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await users.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    res.json("User registered successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.message);
  try {
    const isEmailRegistered = await users.findOne({
      where: { email },
      raw: true,
    });
    if (!isEmailRegistered)
      return res.status(400).json({ error: "Email not found" });

    const validPassword = await bcrypt.compare(
      password,
      isEmailRegistered.password
    );
    if (!validPassword)
      return res.status(400).json({ error: "Password is incorrect" });

    const { password: _, ...user } = isEmailRegistered;
    const token = jwt.sign(user, process.env.TOKEN_SECRET, {
      // TODO: Add refresh token implementation and res.cookie
      expiresIn: "24h",
    });

    res.json({ ...user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// TODO : After implementing the refresh token, implement the logout functionality

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await findAll();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyFavourites = async (req, res) => {
  const user_id = req.user.id;
  try {
    const myFavourites = await movies.findAll({
      attributes: ["id", "name", "year", "description", "image"],
      include: [
        {
          model: favourites,
          attributes: [],
          where: { user_id },
        },
      ],
      raw: true,
    });
    res.json(myFavourites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addToMyFavourites = async (req, res) => {
  const user_id = req.user.id;
  const movie_id = req.params.id;
  try {
    await favourites.create({
      user_id,
      movie_id,
    });
    res.json("Movie added to favourites successfully");
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json("Movie already in favourites");
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
const deleteFromMyFavourites = async (req, res) => {
  const user_id = req.user.id;
  const movie_id = req.params.id;
  try {
    await favourites.destroy({
      where: {
        user_id,
        movie_id,
      },
    });
    res.json("Movie deleted from favourites successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  userRegister,
  userLogin,
  getAllUsers,
  getMyFavourites,
  addToMyFavourites,
  deleteFromMyFavourites,
};
