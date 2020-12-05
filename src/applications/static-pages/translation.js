/* eslint-disable no-console */
// this can be easily replaced with an API call. this follows the pattern of i18 here:
// https://react.i18next.com/getting-started
// namely using a json file to store content in differnt languages
// https://stackoverflow.com/questions/62225698/read-i18n-from-different-json-files-react-i18nnext
import i18Content from './i18Content.json';

function toggleLanguage(e) {
  if (e.target.dataset.lang === 'en') {
    // this would be replaced by an api call
    e.target.dataset.lang = 'es';
    e.target.innerText = i18Content.en.linkTitle;
  } else {
    // this would be replaced by an api call
    e.target.dataset.lang = 'en';
    e.target.innerText = i18Content.es.linkTitle;
  }
}
function setUpi18() {
  const i18link = document.querySelector('a.i18-toggle');
  if (!i18link) return;
  i18link.innerText = i18Content.es.linkTitle;
  i18link.dataset.lang = 'en';
  i18link.addEventListener('click', toggleLanguage);
}

export default () => document.addEventListener('DOMContentLoaded', setUpi18);
