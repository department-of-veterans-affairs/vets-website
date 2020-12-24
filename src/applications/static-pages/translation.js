/* eslint-disable no-console */
// this can be easily replaced with an API call. this follows the pattern of i18 here:
// https://react.i18next.com/getting-started
// namely using a json file to store content in differnt languages
// https://stackoverflow.com/questions/62225698/read-i18n-from-different-json-files-react-i18nnext
import i18Content from './i18Content.json';

const parseSpanishChildLinks = targetLang => {
  const linkSelectors = ['[title="Volunteer for coronavirus research at VA"]'];
  linkSelectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (!element) return;
    // TODO: refactor these ifs
    if (!element.href.includes('-esp') && targetLang === 'es') {
      const espUrl = element.href.concat('-esp');
      element.href = espUrl;
    }
    if (targetLang === 'en' && element.href.includes('-esp')) {
      const englishUrl = element.href.replace('-esp', '');
      element.href = englishUrl;
    }
  });
};
const setLanguageToSpanish = e => {
  const targetLang = 'es';
  (e.target || e).dataset.lang = targetLang;
  (e.target || e).innerText = i18Content.en.linkTitle;
  parseSpanishChildLinks(targetLang);
};
const setLanguageToEnglish = e => {
  const targetLang = 'en';
  (e.target || e).dataset.lang = targetLang;
  (e.target || e).innerText = i18Content.es.linkTitle;
  parseSpanishChildLinks(targetLang);
};
// when the user selects a different language
const toggleLanguage = e => {
  // when the prev language was en and we are now in spanish
  if (e.target.dataset.lang === 'en') {
    // go to the spanish node
    // history.pushState({}, null, 'preview?nodeId=3015');
    // not sure if need to reload the page
    // window.location.reload();
    setLanguageToSpanish(e);
  } else {
    // go to the english node
    // history.pushState({}, null, 'preview?nodeId=3015');
    // window.location.reload();
    setLanguageToEnglish(e);
  }
};

const setLanguageAndParseChildLinks = () => {
  const i18LinkWrapper = document.getElementById('i18-link-wrapper');
  if (!i18LinkWrapper) return;
  const isSpanish = window.location.href.includes('-esp');
  const translatableLinks = [
    // remove the preview nodes from this array when ready to merge
    'nodeId=3014',
    'nodeId=6785',
    'coronavirus-veteran-frequently-asked-questions',
    'covid-19-vaccine',
    'coronavirus-research',
  ];

  const isTranslatable = translatableLinks.some(url =>
    window.location.href.includes(url),
  );
  if (!isTranslatable) {
    i18LinkWrapper.style.display = 'none';
  }
  const i18link = document.querySelector('a.i18-toggle');

  if (!isSpanish) {
    i18link.innerText = i18Content.es.linkTitle;
    i18link.dataset.lang = 'en';
    setLanguageToEnglish(i18link);
  } else {
    i18link.innerText = i18Content.en.linkTitle;
    i18link.dataset.lang = 'es';
    setLanguageToSpanish(i18link);
  }
  i18link.addEventListener('click', toggleLanguage);
};
window.addEventListener('popstate', setLanguageAndParseChildLinks);
export default () =>
  document.addEventListener('DOMContentLoaded', setLanguageAndParseChildLinks);
