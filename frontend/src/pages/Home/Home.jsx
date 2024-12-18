import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import debounce from "lodash.debounce";
import { fetchGenres, fetchMovies } from "../../api/apiServices";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./Home.module.css";
import Modal from "./../../components/Modal/Modal";
import { YEARS, FILTER_KEYS, sortOptions } from "../../consts";
import ChipsBar from "../../components/ChipsBar/ChipsBar";
import DropDown from "../../components/DropDown/DropDown";

function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filterOption, setFilterOption] = useState("genre");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYear, setSelectedYear] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const syncFiltersWithParams = () => {
    setSearchTerm(params.get("q") || "");
    setSelectedGenres(params.getAll("genre"));
    setSelectedYear(params.get("year") || "");
    setSortOption(params.get("sortBy" || "name_asc"));
  };

  const updateFilters = (key, value, isMultiple = false) => {
    if (isMultiple) {
      const values = new Set(params.getAll(key));
      values.has(value) ? values.delete(value) : values.add(value);
      params.delete(key);
      values.forEach((v) => params.append(key, v));
    } else {
      value ? params.set(key, value) : params.delete(key);
    }

    navigate(`?${params.toString()}`);
  };
  useEffect(() => {
    setIsLoading(true);
    syncFiltersWithParams();

    const query = {};

    FILTER_KEYS.forEach((key) => {
      const value = key === "genre" ? params.getAll(key) : params.get(key);
      if (Array.isArray(value) && value.length > 0) {
        query[key] = value.join(",");
      } else if (value) {
        query[key] = value;
      }
    });

    fetchMovies(query)
      .then((res) => {
        setMovies(res.movies);
      })
      .catch((err) => console.error("Error fetching movies:", err))
      .finally(() => setIsLoading(false));
  }, [location.search]);

  const updateSearchQuery = useCallback(
    debounce((query) => {
      updateFilters("q", query);
    }, 500),
    []
  );
  useEffect(() => {
    fetchGenres()
      .then((genres) => setGenres(genres))
      .catch((err) => console.error("Error fetching genres:", err));
  }, []);

  const handleSortChange = (value) => {
    setSortOption(value);
    updateFilters("sortBy", value);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchTerm(query);
    updateSearchQuery(query);
  };

  const clearFilter = (key, value) => {
    if (value && key === "genre") {
      const updatedGenres = selectedGenres.filter((genre) => genre !== value);
      params.delete("genre");
      updatedGenres.forEach((genre) => params.append(key, genre));
    } else {
      params.delete(key);
    }
    navigate(`?${params.toString()}`);
  };

  const clearAllByFilter = (key) => {
    switch (key) {
      case "genre":
        setSelectedGenres([]);
        params.delete("genre");
        break;
      case "year":
        params.delete("year");
        setSelectedYear(0);
        break;
      default:
        break;
    }
    navigate(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedYear("");
    setSearchTerm("");
    navigate("");
  };

  return (
    //TODO : divide into smaller components
    <>
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
                <DropDown
                  options={sortOptions}
                  value={sortOption}
                  onChange={handleSortChange}
                  placeholder="Sort Movies"
                />
              </div>
            </div>
            <div className={styles.filtersChipsBox}>
              <div className={styles.filtersButtonsBox}>
                <button
                  onClick={() => {
                    setFilterOption("genre");
                    setOpenModal(true);
                  }}
                  className={styles.filterButton}
                >
                  Filter by Genre
                </button>

                <button
                  onClick={() => {
                    setFilterOption("year");
                    setOpenModal(true);
                  }}
                  className={styles.filterButton}
                >
                  Filter by Year
                </button>
                <button
                  onClick={clearAllFilters}
                  className={styles.clearFilterButton}
                >
                  Clear All
                </button>
              </div>
              <ChipsBar
                filters={{
                  genre: selectedGenres,
                  year: selectedYear,
                }}
                clearFilter={clearFilter}
              />
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
                {movies.map((movie) => (
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
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={filterOption === "genre" ? "Filter by Genre" : "Filter by Year"}
        height="700px"
        actions={
          <>
            <button
              onClick={() => clearAllByFilter(filterOption)}
              className={styles.modalSubmit}
            >
              Clear Filter
            </button>
            <button
              onClick={() => setOpenModal(false)}
              className={styles.modalCancel}
            >
              Cancel
            </button>
          </>
        }
      >
        <div className={styles.filterList}>
          {filterOption === "genre"
            ? genres.map((genre) => (
                <label key={genre.id} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    value={genre.name}
                    checked={selectedGenres.includes(genre.name)}
                    onChange={(e) =>
                      updateFilters("genre", e.target.value, true)
                    }
                  />
                  {genre.name}
                </label>
              ))
            : filterOption === "year"
            ? YEARS.map((year) => (
                <label key={year} className={styles.filterItem}>
                  <input
                    type="radio"
                    value={year}
                    checked={parseInt(selectedYear) === parseInt(year)}
                    onChange={(e) => updateFilters("year", e.target.value)}
                  />
                  {year}
                </label>
              ))
            : null}
        </div>
      </Modal>
    </>
  );
}

export default Home;
