/* eslint-disable no-console */
import i18Content from './i18Content.json';

const convertChildLinksToTargetLang = targetLang => {
  const linkSelectors = ['[title="Volunteer for coronavirus research at VA"]'];
  linkSelectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (!element) return;
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

const setLang = (e, currentLang, targetLang) => {
  (e.target || e).dataset.lang = currentLang;
  (e.target || e).innerText = i18Content[targetLang].linkTitle;
  (e.target || e).href = i18Content[targetLang].langToggleLink;
  convertChildLinksToTargetLang(targetLang);
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
    setLang(i18link, 'en', 'es');
  } else {
    setLang(i18link, 'es', 'en');
  }
};

window.addEventListener('popstate', setLanguageAndParseChildLinks);
export default () =>
  document.addEventListener('DOMContentLoaded', setLanguageAndParseChildLinks);
