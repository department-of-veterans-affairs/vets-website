import recordEvent from 'platform/monitoring/record-event';

const faqI18Content = {
  en: {
    linkTitle: 'Read this page in English',
    langToggleLink: '/coronavirus-veteran-frequently-asked-questions',
  },
  es: {
    linkTitle: 'Leer esta página en Español',
    langToggleLink: '/coronavirus-veteran-frequently-asked-questions-esp',
  },
};
const configureBreadCrumbLinks = targetLang => {
  const breadCrumbLinks = document.getElementsByClassName('breadcrumb-link');
  breadCrumbLinks.forEach(link => {
    link.setAttribute('lang', targetLang);
  });
};
const configureTranslationLink = (e, targetLang) => {
  e.dataset.lang = targetLang;
  e.lang = targetLang;
  e.innerText = faqI18Content[targetLang].linkTitle;
  e.href = faqI18Content[targetLang].langToggleLink;
  e.onclick = recordEvent({
    event: 'faq-lang-toggle-click',
    faqText: faqI18Content[targetLang].title,
    faqSection: 'coronavirus veteran frequently asked questions',
    targetLang,
  });
  configureBreadCrumbLinks(targetLang);
};
const displayTranslationLink = () => {
  const i18LinkWrapper = document.getElementById('i18-link-wrapper');
  if (!i18LinkWrapper) return;
  const isSpanish =
    window.location.href.includes('-esp') ||
    window.location.href.includes('nodeId=14580');
  const translatableLinks = [
    // uncomment the below line once we get through staging review and remove references to preview node
    // 'coronavirus-veteran-frequently-asked-questions',
    'coronavirus-veteran-frequently-asked-questions-esp',
    'nodeId=14580',
  ];
  const isTranslatable = translatableLinks.some(url =>
    window.location.href.includes(url),
  );
  if (!isTranslatable) return;

  if (i18LinkWrapper.classList.contains('vads-u-display--none')) {
    i18LinkWrapper.classList.remove('vads-u-display--none');
  }
  const i18link = document.querySelector('a.i18-toggle');
  if (!isSpanish) {
    configureTranslationLink(i18link, 'es');
  } else {
    configureTranslationLink(i18link, 'en');
  }
};

window.addEventListener('popstate', displayTranslationLink);
export default () =>
  document.addEventListener('DOMContentLoaded', displayTranslationLink);
