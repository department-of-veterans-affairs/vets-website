import recordEvent from 'platform/monitoring/record-event';

const faqI18Content = {
  en: {
    linkTitle: 'Read this page in English',
    langToggleLink: '/coronavirus-veteran-frequently-asked-questions',
  },
  es: {
    linkTitle: 'Leer esta página en Español',
    langToggleLink: '/coronavirus-veteran-frequently-asked-questions-esp',
    onThisPage: 'Spanish Translation of on this page',
  },
};
const configureTranslationLink = (e, targetLang, currentLang) => {
  e.dataset.lang = targetLang;
  e.lang = targetLang;
  e.innerText = faqI18Content[targetLang].linkTitle;
  e.href = faqI18Content[targetLang].langToggleLink;
  if (currentLang === 'es') {
    const onThisPageEl = document?.getElementById('on-this-page');
    onThisPageEl.innerText = faqI18Content.es.onThisPage;
  }
  e.onclick = _ => {
    recordEvent({
      event: 'nav-covid-link-click',
      faqText: undefined,
      faqSection: undefined,
    });
  };
};
const displayTranslationLink = () => {
  const i18LinkWrapper = document.getElementById('i18-link-wrapper');
  if (!i18LinkWrapper) return;
  const isSpanish = window.location.href.endsWith('-esp/');

  const translatableLinks = new Set([
    '/coronavirus-veteran-frequently-asked-questions/',
    '/coronavirus-veteran-frequently-asked-questions-esp/',
  ]);

  const isTranslatable = translatableLinks.has(document.location.pathname);

  if (!isTranslatable) return;

  if (i18LinkWrapper.classList.contains('vads-u-display--none')) {
    i18LinkWrapper.classList.remove('vads-u-display--none');
  }
  const i18link = document.querySelector('a.i18-toggle');
  if (!isSpanish) {
    configureTranslationLink(i18link, 'es', 'en');
  } else {
    configureTranslationLink(i18link, 'en', 'es');
  }
};

window.addEventListener('popstate', displayTranslationLink);
export default () =>
  document.addEventListener('DOMContentLoaded', displayTranslationLink);
