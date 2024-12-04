import React, { useState, useContext } from "react";
import { BASE_URL } from "../consts";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/authContext";

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

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/movies/add`, movie, {
        headers: {
          Token: currentUser.token,
        },
      })
      .then((res) => {
        console.log(res.data);
        window.location = "/";
      })
      .catch((err) => {
        console.log(err.response);
        setError(err.response.data.sqlMessage);
      });
  }

  return (
    <div>
      <div className="container">
        <h1 className="title">Add a Movie </h1>
        <div className="form-container">
          <form className="form" onSubmit={handleSubmit}>
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
              <label>
                Image URI:
                <input
                  type="text"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                />
              </label>
            </label>
            <label>
              Actors seperated by \r\n:
              <input
                type="text"
                value={actors}
                onChange={(event) => setActors(event.target.value)}
              />
            </label>
            <label>
              Trailer as Embed Video from Youtube :
              <input
                type="text"
                value={trailer}
                onChange={(event) => setTrailer(event.target.value)}
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
      </div>
    </div>
  );
}

export default AddMovie;
