import backend from "./apiClient";

export const fetchMovies = async (query) => {
  const endpoint = query ? `/movies/search?q=${query}` : `/movies`;
  const response = await backend.get(endpoint);
  return response.data;
};

export const fetchFavoriteMovies = async () => {
  const response = await backend.get("/users/favourites");
  return response.data;
};

export const addMovieToFavourites = async (movieId) => {
  const response = await backend.post(`/users/favourites/${movieId}`);
  return response.data;
};

export const removeMovieFromFavourites = async (movieId) => {
  const response = await backend.delete(`/users/favourites/${movieId}`);
  return response.data;
};

export const fetchMovieDetails = async (movieId) => {
  const response = await backend.get(`/movies/${movieId}`);
  return response.data;
};
export const addMovieRating = async (movieId, rating, review) => {
  const response = await backend.post(`/movies/${movieId}/ratings`, {
    rating,
    review,
  });
  return response.data;
};
export const addMovie = async (movie) => {
  const response = await backend.post("/movies/add", movie);
  return response.data;
};

export const login = async (email, password) => {
  const response = await backend.post(
    "/users/login",
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};
export const register = async (name, email, password) => {
  const response = await backend.post("/users/register", {
    name,
    email,
    password,
  });
  return response.data;
};
