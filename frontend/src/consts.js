export const YEARS = Array.from(
  { length: 2024 - 1970 + 1 },
  (_, i) => 2024 - i
);
export const FILTER_KEYS = ["genre", "year", "sortBy", "q"];

export const sortOptions = [
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "year_asc", label: "Year (Ascending)" },
  { value: "year_desc", label: "Year (Descending)" },
];
