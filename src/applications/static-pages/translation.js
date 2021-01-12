import i18Content from './i18Content.json';
import recordEvent from 'platform/monitoring/record-event';

const setLang = (e, currentLang, targetLang) => {
  const contentDiv = document.getElementById('content');
  contentDiv.lang = currentLang;
  e.dataset.lang = currentLang;
  e.innerText = i18Content[targetLang].linkTitle;
  e.href = i18Content[targetLang].langToggleLink;
  e.onclick = recordEvent({
    event: 'faq-lang-toggle',
    targetLang,
  });
  // convertChildLinksToTargetLang(targetLang);
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
    // 'covid-19-vaccine',
    // 'coronavirus-research',
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
