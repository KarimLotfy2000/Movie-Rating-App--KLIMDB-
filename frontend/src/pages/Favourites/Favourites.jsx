import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./Favourites.module.css";
import { useError } from "../../context/errorContext";
import {
  fetchFavoriteMovies,
  removeMovieFromFavourites,
} from "../../api/apiServices";

function Favourites() {
  const [favouriteMovies, setFavouriteMovies] = useState([]);

  const showSnackbar = useError();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await fetchFavoriteMovies();
        setFavouriteMovies(movies);
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to fetch favourites.";
        showSnackbar(errorMessage, "error");
      }
    };

    fetchMovies();
  }, []);

  const removeFromFavorites = async (movieId) => {
    try {
      await removeMovieFromFavourites(movieId);

      setFavouriteMovies((prev) =>
        prev.filter((movie) => movie.id !== movieId)
      );

      showSnackbar("Movie removed from favourites.", "info");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to remove the movie.";
      showSnackbar(errorMessage, "error");
    }
  };

  return (
    <div className={styles.bigbox}>
      <h1 className={styles.title}>
        {favouriteMovies.length === 0
          ? "No Movies added to your Favourites"
          : "Your Favourite Movies:"}
      </h1>
      <div className={styles.list}>
        {favouriteMovies.map((movie) => (
          <MovieCard
            movie={movie}
            islower={true}
            favouritesPage={true}
            key={movie.id}
            onRemove={removeFromFavorites}
          />
        ))}
      </div>
    </div>
  );
}

export default Favourites;
