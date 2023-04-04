import './css/styles.css';
import fetchCountriesName from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

const cleanMarkup = ref => (ref.innerHTML = '');

function handleInput(event) {
  const countryName = event.target.value.trim();

  if (!countryName) {
    cleanMarkup(listEl, infoEl);
    return;
  }

  fetchCountriesName(countryName)
    .then(data => {
      if (data.length > 10) {
        const message = `Too many matches found. Please enter a more specific name.`;
        Notiflix.Notify.success(message);
      } else if (data.length >= 2 && data.length <= 10) {
        cleanMarkup(infoEl);
        listEl.innerHTML = markupForSymbols(data);
      } else if (data.length === 1) {
        cleanMarkup(listEl);
        infoEl.innerHTML = markupForCountry(data);
      }
    })

    .catch(error => {
      console.log(error);
      Notiflix.Notify.warning('Oops, there is no country with that name');
    });
}

function markupForSymbols(array) {
  return array
    .map(({ name, flags }) => {
      return `
        <li>
          <div class="wrap-flag"><img src="${flags.svg}" alt="${flags.alt}" width="80" height="auto"></div>
          <p class="country-name">${name.official}</p>
        </li>`;
    })
    .join('');
}

function markupForCountry(array) {
  return array
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="wrap-flag"><img src="${flags.svg}" alt="${
        flags.alt
      }" width="300" height="auto"></div>
      <h2 class="country-name">${name.official}</h2>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
}
