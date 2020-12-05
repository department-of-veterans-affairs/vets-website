/* eslint-disable no-console */
// this can be easily replaced with an API call. this follows the pattern of i18 here, namely using a json file
// to store content in differnt languages
// https://react.i18next.com/getting-started
const i18Content = {
  en: { linkTitle: 'Read this page in English' },
  es: { linkTitle: 'Leer esta pagina en espanol' },
};
function toggleLanguage(e) {
  if (e.target.dataset.lang === 'en') {
    e.target.dataset.lang = 'es';
    e.target.innerText = i18Content.en.linkTitle;
  } else {
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
