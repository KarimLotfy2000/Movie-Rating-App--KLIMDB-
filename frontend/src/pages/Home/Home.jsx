import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import debounce from "lodash.debounce";
import { sortMovies } from "../../utils";
import { fetchMovies } from "../../api/apiServices";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./Home.module.css";
import { useError } from "./../../context/errorContext";

function Home() {
  const [movies, setMovies] = useState([]);
  const [sortedMovies, setSortedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title-asc");
  const navigate = useNavigate();
  const location = useLocation();
  const showSnackbar = useError();

  const getSearchTermFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("q") || "";
  };

  const handleFetchMovies = async (query) => {
    try {
      setIsLoading(true);
      const movies = await fetchMovies(query);

      if (movies.length === 0) {
        setMovies([]);
      } else {
        setMovies(movies);
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch movies", "error");
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
    handleFetchMovies(query);
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
    <div className={styles.bigbox}>
      {isLoading ? (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <>
          <div className={styles.searchSortBox}>
            <div className={styles.searchBox}>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search movies..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.sortBox}>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className={styles.sortDropdown}
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
            <div className={styles.list}>
              {sortedMovies.map((movie) => (
                <MovieCard
                  movie={movie}
                  islower={true}
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
