import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AuthContext } from "../context/authContext";
import { BASE_URL } from "../consts";

function RateMovie() {
  const [movie, setMovie] = useState({});
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const { id } = useParams();
  const [error, setError] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [actors, setActors] = useState([]);
  const [avgRating, setavgRating] = useState("");
  const [allreviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const header = currentUser
    ? { headers: { Token: currentUser.token } }
    : undefined;

  function fetchRateAndReviews() {
    axios
      .get(`${BASE_URL}/movies/${id}/reviews`, header)
      .then((res) => {
        setAllReviews(res.data);
      })
      .catch((err) => setError(err.response.data));
    axios
      .get(`${BASE_URL}/movies/${id}/avg`, header)
      .then((res) => {
        setavgRating(res.data[0].avg_rating);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/movies/${id}`)
      .then((res) => {
        setMovie(res.data[0]);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));

    fetchRateAndReviews();
  }, []);

  useEffect(() => {
    if (movie.actors) {
      setActors(movie.actors);
    }
  }, [movie]);

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(
        `${BASE_URL}/movies/${id}/ratings`,
        {
          user_id: currentUser.id,
          movie_id: id,
          rating,
          review,
        },
        header
      )
      .then((res) => {
        fetchRateAndReviews();
        console.log(res);
      })
      .catch((err) => {
        setError(err.response.data);
        console.log(err.response);
      });
  }

  return (
    <div>
      <h1 className="title"> Rate the Movie :</h1>
      <div className="container-rate">
        <div className="list">
          <MovieCard
            movie={movie}
            islower={false}
            bigger={true}
            rating={avgRating}
            key={movie.id}
            favouritesPage={false}
          />

          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div
                className="movie-trailer"
                dangerouslySetInnerHTML={{ __html: movie.trailer }}
              />

              <div className="actors-box review-card">
                <h1>Actors</h1>
                <ul>
                  {actors.map((actor) => {
                    return <li key={actor}>{actor}</li>;
                  })}
                </ul>
              </div>
              <div className="review-form-container  ">
                <form className="form" onSubmit={handleSubmit}>
                  <label>
                    Rating:
                    <input
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                    />
                  </label>
                  <label>
                    Review:
                    <input
                      type="text"
                      value={review}
                      onChange={(event) => setReview(event.target.value)}
                    />
                  </label>

                  <button className="submit-button" type="submit">
                    Submit
                  </button>
                  {error && (
                    <div className="error-box">
                      <div className="error-message">{error}</div>
                    </div>
                  )}
                </form>
              </div>

              {allreviews.length > 0 && (
                <div className="review-card">
                  <h4>All Reviews</h4>
                  <ul>
                    {allreviews.map((review) => (
                      <li key={review.id}>
                        <span className="review-name">{review.name}</span>
                        <span> "{review.review}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RateMovie;
