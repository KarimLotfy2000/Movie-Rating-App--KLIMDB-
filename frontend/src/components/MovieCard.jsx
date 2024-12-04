import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { BASE_URL } from "../consts";
function MovieCard({
  movie,
  bigger,
  rating,
  islower,
  favouritesPage,
  onRemove,
}) {
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timerId = setTimeout(() => {
        setShowError(false);
        setError("");
      }, 2000);

      return () => clearTimeout(timerId);
    }
  }, [error]);

  function addFavourite() {
    axios
      .post(
        `${BASE_URL}/users/${currentUser.id}/favourites`,
        { movie_id: movie.id },
        {
          headers: {
            Token: currentUser.token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setError("Movie Added to your Favourites");
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          console.log(err);
          setError("Movie is already in your favorites");
        } else {
          setError("An error occurred while adding the movie to favorites");
        }
      });
  }

  function removeFavourite() {
    onRemove(movie.id);
  }

  return (
    <div className={bigger ? "card big-card" : "card"}>
      <img
        src={movie.image}
        alt={movie.name}
        className={bigger ? "card-img big-img" : "card-img"}
      />
      <div className="card-body">
        {rating && (
          <div className="avg-rating">
            <p className="avg-rating-txt">Rating: {rating}</p>
          </div>
        )}
        <h5 className={bigger ? "card-title big-card-title" : "card-title"}>
          {movie.name}
        </h5>
        <p className={bigger ? "card-year big-card-year" : "card-year"}>
          {movie.year}
        </p>
        {bigger && (
          <p
            className={
              bigger
                ? "card-description big-card-description"
                : "card-description"
            }
          >
            {movie.description}
          </p>
        )}
      </div>
      <div className="button-box">
        {islower && currentUser && (
          <Link to={`/rate/${movie.id}`} style={{ textDecoration: "none" }}>
            <button className="r-button">Show more ...</button>
          </Link>
        )}

        {favouritesPage && (
          <button onClick={removeFavourite} className="r-button">
            Remove
          </button>
        )}

        {currentUser && favouritesPage === false && (
          <button onClick={() => addFavourite()} className="f-button">
            <FontAwesomeIcon icon={faHeart} color="purple" />
          </button>
        )}
      </div>

      {showError && (
        <div className="error-box">
          <div className="error-content">
            <div className="error-message">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieCard;
