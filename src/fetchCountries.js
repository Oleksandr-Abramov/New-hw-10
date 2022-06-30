const API_KEY = 'https://restcountries.com/v3.1/name/';
export const fetchCountries = name => {
  return fetch(`${API_KEY}${name}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
