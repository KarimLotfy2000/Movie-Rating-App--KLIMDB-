const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const moviesRouter = require("./routes/moviesRouter");
const searchRouter = require("./routes/searchRouter");

const dotenv = require("dotenv");
dotenv.config();

//for Building RESt API
app = express();

//enable clients from different domains to access the resources of the server.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// to parse incoming JSON data in the request body
app.use(express.json());

// Routes Middlware
app.use("/users", userRouter);
app.use("/movies", moviesRouter);
app.use("/search", searchRouter);

//Initiating Server
app.listen(7000, () => {
  console.log("Server running on port 7000");
});
