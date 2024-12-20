import React, { useState } from "react";
import styles from "./AddMovie.module.css";
import { addMovie } from "../../api/apiServices";

function AddMovie() {
  const [name, setName] = useState("");
  const [year, setYear] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [trailer, setTrailer] = useState("");
  const [error, setError] = useState("");

  const movie = { name, year, description, image, trailer };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await addMovie(movie);

      window.location = "/";
    } catch (error) {
      const errorMessage = error.response.data.error || error.message;
      setError(errorMessage);
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
            Image URI:
            <input
              type="text"
              value={image}
              onChange={(event) => setImage(event.target.value)}
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
