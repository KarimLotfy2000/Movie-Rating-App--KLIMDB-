import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { AuthContext } from "../context/authContext";
import { BASE_URL } from "../consts";

function Favourites() {
  const { currentUser } = useContext(AuthContext);
  const [favouriteMovies, setFavouriteMovies] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/users/${currentUser.id}/favourites`, {
        headers: {
          Token: currentUser.token,
        },
      })
      .then((res) => setFavouriteMovies(res.data))
      .catch((err) => console.log(err));
  }, []);

  function removeFromFavorites(movieId) {
    axios
      .delete(`${BASE_URL}/users/${currentUser.id}/favourites/${movieId}`, {
        headers: {
          Token: currentUser.token,
        },
      })
      .then(() => {
        setFavouriteMovies((prev) =>
          prev.filter((movie) => movie.id !== movieId)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="bigbox">
      <h1 className="title">Your Favourite Movies : </h1>
      <div className="list">
        {favouriteMovies.map((movie) => (
          <MovieCard
            movie={movie}
            islower={true}
            bigger={false}
            key={movie.id}
            favouritesPage={true}
            onRemove={removeFromFavorites}
          />
        ))}
      </div>
    </div>
  );
}

export default Favourites;
