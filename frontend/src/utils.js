export const sortMovies = (movies, option) => {
  const sortedMovies = [...movies];
  if (option === "title-asc") {
    return sortedMovies.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (option === "title-desc") {
    return sortedMovies.sort((a, b) => b.name.localeCompare(a.name));
  }
  if (option === "year-desc") {
    return sortedMovies.sort((a, b) => b.year - a.year);
  }
  if (option === "year-asc") {
    return sortedMovies.sort((a, b) => a.year - b.year);
  }
  return movies;
};
