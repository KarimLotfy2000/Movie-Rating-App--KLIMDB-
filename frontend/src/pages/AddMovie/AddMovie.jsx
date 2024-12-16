import React, { useState, useContext } from "react";
import { BASE_URL } from "../../consts";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import styles from "./AddMovie.module.css";
import { addMovie } from "../../api/apiServices";

function AddMovie() {
  const { currentUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [year, setYear] = useState(0);
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState("");
  const [actors, setActors] = useState("");
  const [trailer, setTrailer] = useState("");
  const [error, setError] = useState("");

  const movie = { name, year, description, genre, image, actors, trailer };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await addMovie(movie);

      window.location = "/";
    } catch (error) {
      console.log(error);
      const errorMessage = error.response.data.error || error.message;
      setError(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add a Movie</h1>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleAddMovie}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            Year:
            <input
              type="number"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <label>
            Genre:
            <input
              type="text"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            />
          </label>
          <label>
            Image URI:
            <input
              type="text"
              value={image}
              onChange={(event) => setImage(event.target.value)}
            />
          </label>
          <label>
            Actors separated by \r\n:
            <input
              type="text"
              value={actors}
              onChange={(event) => setActors(event.target.value)}
            />
          </label>
          <label>
            Trailer as Embed Video from YouTube:
            <input
              type="text"
              value={trailer}
              onChange={(event) => setTrailer(event.target.value)}
            />
          </label>
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
          {error && (
            <div className={styles.errorBox}>
              <div className={styles.errorMessage}>{error}</div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddMovie;
