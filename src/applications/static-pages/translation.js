/* eslint-disable no-console */
// this can be easily replaced with an API call. this follows the pattern of i18 here:
// https://react.i18next.com/getting-started
// namely using a json file to store content in differnt languages
// https://stackoverflow.com/questions/62225698/read-i18n-from-different-json-files-react-i18nnext
import i18Content from './i18Content.json';

const toggleLanguage = e => {
  // we need logic here to add the "esp" suffix to the url, or remove it
  // history.pushState({}, null, 'preview?nodeId=3015');
  // window.location.reload();
  if (e.target.dataset.lang === 'en') {
    // this would be replaced by an api call
    e.target.dataset.lang = 'es';
    e.target.innerText = i18Content.en.linkTitle;
  } else {
    // this would be replaced by an api call
    e.target.dataset.lang = 'en';
    e.target.innerText = i18Content.es.linkTitle;
  }
};

const setUpi18 = () => {
  const i18LinkWrapper = document.getElementById('i18-link-wrapper');
  if (!i18LinkWrapper) return;

  const validUrls = [
    // remove the preview node from this array when ready to merge
    'nodeId=3014',
    'coronavirus-veteran-frequently-asked-questions',
    'covid-19-vaccine',
    'coronavirus-research',
  ];

  const isTranslatable = validUrls.some(url =>
    window.location.href.includes(url),
  );
  if (!isTranslatable) {
    i18LinkWrapper.style.display = 'none';
  }

  const i18link = document.querySelector('a.i18-toggle');
  i18link.innerText = i18Content.es.linkTitle;
  i18link.dataset.lang = 'en';
  i18link.addEventListener('click', toggleLanguage);
};

export default () => document.addEventListener('DOMContentLoaded', setUpi18);
