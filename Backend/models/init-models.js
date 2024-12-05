var DataTypes = require("sequelize").DataTypes;
var _favourites = require("./favourites");
var _movies = require("./movies");
var _ratings = require("./ratings");
var _users = require("./users");

function initModels(sequelize) {
  var favourites = _favourites(sequelize, DataTypes);
  var movies = _movies(sequelize, DataTypes);
  var ratings = _ratings(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  favourites.belongsTo(movies, { as: "movie", foreignKey: "movie_id"});
  movies.hasMany(favourites, { as: "favourites", foreignKey: "movie_id"});
  ratings.belongsTo(movies, { as: "movie", foreignKey: "movie_id"});
  movies.hasMany(ratings, { as: "ratings", foreignKey: "movie_id"});
  favourites.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(favourites, { as: "favourites", foreignKey: "user_id"});
  ratings.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(ratings, { as: "ratings", foreignKey: "user_id"});

  return {
    favourites,
    movies,
    ratings,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
