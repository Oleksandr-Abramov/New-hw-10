import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener(
  'input',
  debounce(onSearchCountries, DEBOUNCE_DELAY)
);

function onSearchCountries(evt) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  const input = evt.target.value;
  fetchCountries(input)
    .then(getCountries)
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
    });
}

function getCountries(arr) {
  const counties = arr.map(
    ({
      name: { official },
      capital,
      population,
      flags: { svg },
      languages,
    }) => ({ official, capital, population, svg, languages })
  );
  sortCountries(counties);
}

function sortCountries(counties) {
  if (counties.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (counties.length <= 10 && counties.length >= 2) {
    marcupForManyCountries(counties);
  } else {
    marcupForOneCountry(counties);
  }
}

function marcupForManyCountries(arr) {
  const marcup = arr.map(
    ({
      official,
      svg,
    }) => `<li><img src="${svg}" alt="flag of ${official}" width="100" /><p>${official}</p></li>
    `
  );
  countryList.innerHTML = '';
  countryList.insertAdjacentHTML('afterbegin', marcup.join(''));
}

function marcupForOneCountry(arr) {
  const obj = arr.reduce((acc, el) => acc);
  const { capital, languages, official, population, svg } = obj;
  const lang = getLanguages(languages);
  const marcup = `<img src="${svg}" alt="flag of ${official}" width="100" /><p>${official}</p>
  <p>Capital: ${capital}</p>
  <p>Population: ${population}</p>
  <p>Languages: ${lang}</p>
    `;
  countryList.innerHTML = '';
  countryInfo.insertAdjacentHTML('afterbegin', marcup);
}

function getLanguages(obj) {
  let languages = '';
  for (key in obj) {
    languages += obj[key] + ', ';
  }
  return languages.slice(0, languages.length - 2);
}
