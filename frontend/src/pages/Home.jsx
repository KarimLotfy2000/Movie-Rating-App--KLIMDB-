import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { BASE_URL } from "../consts";
import { sortMovies } from "../utils";

function Home() {
  const [movies, setMovies] = useState([]);
  const [sortedMovies, setSortedMovies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title-asc");
  const navigate = useNavigate();
  const location = useLocation();

  const getSearchTermFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("q") || "";
  };

  const fetchMovies = async (query) => {
    try {
      setIsLoading(true);
      const endpoint = query
        ? `${BASE_URL}/search/?q=${query}`
        : `${BASE_URL}/movies/`;
      const response = await axios.get(endpoint);

      if (response.data.length === 0) {
        setMovies([]);
      } else {
        setMovies(response.data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching movies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
  };

  useEffect(() => {
    const query = getSearchTermFromURL();
    setSearchTerm(query);
    fetchMovies(query);
  }, [location.search]);

  useEffect(() => {
    const sorted = sortMovies(movies, sortOption);
    setSortedMovies(sorted);
  }, [movies, sortOption]);

  const updateSearchQuery = useCallback(
    debounce((query) => {
      navigate(`?q=${query}`, { replace: true });
    }, 500),
    [navigate]
  );

  const handleSearchChange = (event) => {
    const query = event.target.value.trim();
    setSearchTerm(query);
    updateSearchQuery(query);
  };

  return (
    <div className="bigbox">
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="search-sort-box">
            <div className="search-box">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search movies..."
                className="search-input"
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            <div className="sort-box">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="sort-dropdown"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="year-desc">Year (Newest)</option>
                <option value="year-asc">Year (Oldest)</option>
              </select>
            </div>
          </div>

          {movies.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                marginTop: "60px",
                fontSize: "32px",
                color: "white",
              }}
            >
              No movies found
            </div>
          ) : (
            <div className="list">
              {sortedMovies.map((movie) => (
                <MovieCard
                  movie={movie}
                  islower={true}
                  bigger={false}
                  favouritesPage={false}
                  key={movie.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
