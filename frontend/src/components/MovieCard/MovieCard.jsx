import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../context/authContext";
import styles from "./MovieCard.module.css";
import { useError } from "../../context/errorContext";
import { addMovieToFavourites } from "../../api/apiServices";

const MovieCard = ({ movie, onRemove, favouritesPage }) => {
  const { currentUser } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);
  const showSnackbar = useError();

  const navigate = useNavigate();

  const handleAddToFavourites = async (event) => {
    event.stopPropagation();
    if (currentUser) {
      try {
        await addMovieToFavourites(movie.id);
        showSnackbar("Movie added to your favourites.", "success");
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message;
        showSnackbar(errorMessage, "error");
      }
    } else {
      navigate("/login");
      showSnackbar(
        "You need to be logged in to add a movie to your favourites.",
        "error"
      );
    }
  };

  const removeFavourite = (event) => {
    event.stopPropagation();
    onRemove(movie.id);
  };

  const handleCardClick = () => {
    navigate(`/rate/${movie.id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {!loaded && <div className={styles.skeleton}></div>}

        <img
          src={movie.image}
          alt={movie.name}
          className={`${styles.cardImg} ${loaded ? styles.loaded : ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => console.error("Failed to load image")}
        />

        <button
          className={styles.favouriteButton}
          onClick={favouritesPage ? removeFavourite : handleAddToFavourites}
        >
          <FontAwesomeIcon icon={favouritesPage ? faTrash : faHeart} />
        </button>
      </div>
      <div className={styles.cardBody}>
        <h5 className={styles.cardTitle}>{movie.name}</h5>
        <p className={styles.cardYear}>{movie.year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
