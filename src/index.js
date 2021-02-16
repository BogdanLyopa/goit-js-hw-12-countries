import './styles.css';
import refs from './js/refs';
import debounce from 'lodash.debounce';
import countriesTpl from './templates/countries.hbs';
import countryTpl from './templates/country.hbs';
import fetchCountries from './js/fetchCountries';
import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

function renderCountry(countries, template) {
  const inputValue = refs.input.value;
  fetchCountries(inputValue).then(countries => {
    const markup = template(countries);
    refs.list.innerHTML = markup;
  });
}
function render(countriesArray) {
  if (countriesArray.status == '404') {
    error({
      title: 'Cannot find your country',
    });
  } else if (countriesArray.length > 10) {
    info({
      title: 'To many matches found. Please enter moore specific query!',
    });
    refs.list.innerHTML = ' ';
  } else if (countriesArray.length === 1) {
    renderCountry(countriesArray, countryTpl);
  } else {
    renderCountry(countriesArray, countriesTpl);
  }
}
function searchCountry(value) {
  fetchCountries(value).then(countries => render(countries));
}
refs.input.addEventListener(
  'input',
  debounce(() => {
    searchCountry(refs.input.value);
  }, 500),
);
