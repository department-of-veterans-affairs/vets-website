/* eslint-disable no-console */
import i18Content from './i18Content.json';
import recordEvent from 'platform/monitoring/record-event';

const configureTranslationLink = (e, currentLang, targetLang) => {
  const contentDiv = document.getElementById('content');
  contentDiv.lang = currentLang;
  e.dataset.lang = currentLang;
  e.innerText = i18Content[targetLang].linkTitle;
  e.href = i18Content[targetLang].langToggleLink;
  e.onclick = recordEvent({
    event: 'faq-lang-toggle',
    targetLang,
  });
};

const displayTranslationLink = () => {
  const i18LinkWrapper = document.getElementById('i18-link-wrapper');
  if (!i18LinkWrapper) return;
  const isSpanish = window.location.href.includes('-esp');
  const translatableLinks = [
    // uncomment the below line once we get through staging review
    // 'coronavirus-veteran-frequently-asked-questions',
    'coronavirus-veteran-frequently-asked-questions-esp',
    'nodeId=14580',
  ];
  const isTranslatable = translatableLinks.some(url =>
    window.location.href.includes(url),
  );

  if (!isTranslatable) {
    i18LinkWrapper.style.display = 'none';
  }
  const i18link = document.querySelector('a.i18-toggle');

  if (!isSpanish) {
    configureTranslationLink(i18link, 'en', 'es');
  } else {
    configureTranslationLink(i18link, 'es', 'en');
  }
};

window.addEventListener('popstate', displayTranslationLink);
export default () =>
  document.addEventListener('DOMContentLoaded', displayTranslationLink);
