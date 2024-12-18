const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const moviesRouter = require("./routes/moviesRouter");
const { sequelize } = require("./models");

const dotenv = require("dotenv");
dotenv.config();

app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.use(express.json());

app.use("/users", userRouter);
app.use("/movies", moviesRouter);

app.listen(7000, () => {
  console.log("Server running on port 7000");
});
