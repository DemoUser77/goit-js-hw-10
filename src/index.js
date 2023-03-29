import './css/styles.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputFormEl = document.querySelector('#search-box');
const listCountryEl = document.querySelector('.country-list');
const infoCountryEl = document.querySelector('.country-info');

inputFormEl.addEventListener('input',debounce(handleInput,DEBOUNCE_DELAY ));

function handleInput(event) {
    event.preventDefault();

    const valueInput = inputFormEl.value.trim()
 
   fetchCountries(valueInput)
        .then(data => {
            listCountryEl.innerHTML = ('')
            infoCountryEl.innerHTML = ('')
            if (data.length === 1) {
                listCountryEl.insertAdjacentHTML('beforeend', renderListCountry(data))
                infoCountryEl.insertAdjacentHTML('beforeend', renderInfoCountry(data))
            } else if (data.length >= 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            }
        })
        .catch(error => {
            Notify.failure('Oops, there is no country with that name')
            
            console.warn(error)
        })
   
function renderListCountry(data) {
        const markup = data
            .map(({ name, flags }) => {
                return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 100px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
            })
            .join('')
        return markup
    }

    function renderInfoCountry(data) {
        const markup = data
            .map(({ capital, population, languages }) => {
                return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages)}</p></li>
        </ul>
        `
            })
            .join('')
        return markup
    }
}
