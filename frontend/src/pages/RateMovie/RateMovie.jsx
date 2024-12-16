import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { fetchMovieDetails, addMovieRating } from "../../api/apiServices";
import { useError } from "../../context/errorContext";
import styles from "./RateMovie.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal/Modal";
function RateMovie() {
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [ratingInput, setRatingInput] = useState("");
  const [reviewInput, setReviewInput] = useState("");
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const showSnackbar = useError();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
        setReviews(data.reviews || []);
      } catch (err) {
        showSnackbar("Failed to load movie details", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [id, showSnackbar]);

  const closeModal = () => {
    setRatingInput("");
    setReviewInput("");
    setError("");
    setOpenModal(false);
  };
  const handleRate = async () => {
    setError("");
    if (!currentUser) {
      navigate("/login");
      showSnackbar(
        "You need to be logged in to rate and review a movie.",
        "error"
      );
      return;
    }
    if (!ratingInput || !reviewInput.trim()) {
      setError("Rating and Review cannot be empty.");
      return;
    }

    if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      await addMovieRating(id, ratingInput, reviewInput);
      setReviews((prev) => [
        ...prev,
        { name: currentUser.name, review: reviewInput },
      ]);
      showSnackbar("Your rating and review were submitted!", "success");
      closeModal();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to submit your rating.";
      showSnackbar(errorMessage, "error");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.rateMovieContainer}>
      <div className={styles.movieHeader}>
        <h1 className={styles.movieTitle}>{movie.name}</h1>
        <div className={styles.subInfo}>
          <span className={styles.movieYear}>{movie.year}</span>
          <span className={styles.movieGenre}>
            {movie.genre?.toUpperCase()}
          </span>
          <span className={styles.movieRating}>
            {movie.average_rating || "N/A"}/5
          </span>
          <button
            className={styles.rateButton}
            onClick={() => setOpenModal(true)}
          >
            <FontAwesomeIcon icon={faStar} />
          </button>
        </div>
      </div>
      <div className={styles.movieMedia}>
        <img
          src={movie.image}
          alt={movie.name}
          className={styles.moviePoster}
        />
        <div
          className={styles.movieTrailer}
          dangerouslySetInnerHTML={{ __html: movie.trailer }}
        />
      </div>
      <div className={styles.posterWithTextContainer}>
        <div className={styles.leftPosterWithText}>
          <img
            src={movie.image}
            alt={movie.name}
            className={styles.moviePosterBottom}
          />
        </div>
        <div classNames={styles.rightPosterWithText}>
          <div className={styles.movieDescription}>
            <h2>Plot Summary</h2>
            <p>{movie.description}</p>
          </div>
          {movie.actors?.length > 0 && (
            <div className={styles.actorsSection}>
              <h2>Cast</h2>
              <div className={styles.actorsList}>
                {movie.actors.map((actor, index) => (
                  <span key={index} className={styles.actorItem}>
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.reviewsSection}>
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div className={styles.reviewItem} key={index}>
              <div className={styles.reviewAvatar}>{review.name.charAt(0)}</div>
              <div className={styles.reviewContent}>
                <h4>{review.name}</h4>
                <p>{review.review}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noReviews}>
            No reviews yet. Be the first to rate and review this movie!
          </p>
        )}
      </div>
      <Modal
        isOpen={openModal}
        onClose={closeModal}
        title="Rate This Movie"
        actions={
          <>
            <button onClick={handleRate} className={styles.modalSubmit}>
              Submit
            </button>
            <button onClick={closeModal} className={styles.modalCancel}>
              Cancel
            </button>
          </>
        }
      >
        {error && <p className={styles.errorText}>{error}</p>}
        <input
          type="number"
          value={ratingInput}
          onChange={(e) => setRatingInput(e.target.value)}
          placeholder="Rating (1-5)"
          className={styles.modalInput}
          min="1"
          max="5"
        />
        <textarea
          value={reviewInput}
          onChange={(e) => setReviewInput(e.target.value)}
          placeholder="Write your review..."
          className={styles.modalTextarea}
        />
      </Modal>
    </div>
  );
}

export default RateMovie;
