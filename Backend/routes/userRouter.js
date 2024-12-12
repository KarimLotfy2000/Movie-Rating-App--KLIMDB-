//userRouter.js
const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  getAllUsers,
  getMyFavourites,
  addToMyFavourites,
  deleteFromMyFavourites,
} = require("../controllers/usersController");
const { verifyToken, verifyTokenAndAdmin } = require("../utils/verify");

// Register
router.post("/register", userRegister);

// Login
router.post("/login", userLogin);

// Get All Users
router.get("/", verifyTokenAndAdmin, getAllUsers);

// Get My Favourites
router.get("/favourites", verifyToken, getMyFavourites);

// Add to My Favourites
router.post("/favourites/:id", verifyToken, addToMyFavourites);

// Delete from My Favourites
router.delete("/favourites/:id", verifyToken, deleteFromMyFavourites);

module.exports = router;
