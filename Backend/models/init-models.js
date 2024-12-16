var DataTypes = require("sequelize").DataTypes;
var _favourites = require("./favourites");
var _movies = require("./movies");
var _ratings = require("./ratings");
var _users = require("./users");
var _actors = require("./actors");
var _genres = require("./genres");
var _movie_actors = require("./movie_actors");
var _movie_genres = require("./movie_genres");

function initModels(sequelize) {
  var favourites = _favourites(sequelize, DataTypes);
  var movies = _movies(sequelize, DataTypes);
  var ratings = _ratings(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var actors = _actors(sequelize, DataTypes);
  var genres = _genres(sequelize, DataTypes);
  var movie_actors = _movie_actors(sequelize, DataTypes);
  var movie_genres = _movie_genres(sequelize, DataTypes);

  favourites.belongsTo(movies, { as: "movie", foreignKey: "movie_id" });
  movies.hasMany(favourites, { as: "favourites", foreignKey: "movie_id" });

  ratings.belongsTo(movies, { as: "movie", foreignKey: "movie_id" });
  movies.hasMany(ratings, { as: "ratings", foreignKey: "movie_id" });

  favourites.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(favourites, { as: "favourites", foreignKey: "user_id" });

  ratings.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(ratings, { as: "ratings", foreignKey: "user_id" });

  movie_actors.belongsTo(movies, { as: "movie", foreignKey: "movie_id" });
  movies.hasMany(movie_actors, { as: "movie_actors", foreignKey: "movie_id" });

  movie_actors.belongsTo(actors, { as: "actor", foreignKey: "actor_id" });
  actors.hasMany(movie_actors, { as: "movie_actors", foreignKey: "actor_id" });

  movie_genres.belongsTo(movies, { as: "movie", foreignKey: "movie_id" });
  movies.hasMany(movie_genres, { as: "movie_genres", foreignKey: "movie_id" });

  movie_genres.belongsTo(genres, { as: "genre", foreignKey: "genre_id" });
  genres.hasMany(movie_genres, { as: "movie_genres", foreignKey: "genre_id" });

  movies.belongsToMany(actors, {
    through: movie_actors,
    as: "actors",
    foreignKey: "movie_id",
    otherKey: "actor_id",
  });
  actors.belongsToMany(movies, {
    through: movie_actors,
    as: "movies",
    foreignKey: "actor_id",
    otherKey: "movie_id",
  });

  movies.belongsToMany(genres, {
    through: movie_genres,
    as: "genres",
    foreignKey: "movie_id",
    otherKey: "genre_id",
  });
  genres.belongsToMany(movies, {
    through: movie_genres,
    as: "movies",
    foreignKey: "genre_id",
    otherKey: "movie_id",
  });

  return {
    favourites,
    movies,
    ratings,
    users,
    actors,
    genres,
    movie_actors,
    movie_genres,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
