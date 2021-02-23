import recordEvent from 'platform/monitoring/record-event';

const faqI18Content = {
  en: {
    linkTitle: 'Read this page in English',
    langToggleLink: '/coronavirus-veteran-frequently-asked-questions',
  },
  es: {
    linkTitle: 'Leer esta página en Español',
    langToggleLink: '/coronavirus-veteran-frequently-asked-questions-esp',
    onThisPage: 'En esta página',
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

const configureSharableLink = () => {
  const shareLinks = document.getElementsByClassName('share-link');
  // eslint-disable-next-line no-console
  console.log('SHARE LINKS', shareLinks);

  if (!shareLinks.length) return;

  for (const shareLink of shareLinks) {
    shareLink.onclick = () => {
      // copy link to users clipboard
      const input = document.createElement('input');
      const dataEntityId = shareLink?.closest('[data-entity-id]')?.attributes[
        'data-entity-id'
      ]?.value;
      // change size of text
      // remove margin Top
      shareLink.setAttribute('id', dataEntityId);
      const shareLinkText = shareLink.nextElementSibling;
      const copyUrl = window.location.href.replace(window.location.hash, '');
      input.setAttribute('value', `${copyUrl}#${dataEntityId}`);
      document.body.appendChild(input);
      input.select();
      const result = document.execCommand('copy');
      document.body.removeChild(input);
      // eslint-disable-next-line no-console
      console.log('COPIED THIS TO CLIPBOARD: ', result);
      if (shareLinkText?.classList.contains('vads-u-display--none')) {
        // eslint-disable-next-line no-unused-expressions
        shareLinkText?.classList.remove('vads-u-display--none');
      }
      setTimeout(() => {
        // eslint-disable-next-line no-unused-expressions
        shareLinkText?.classList.add('vads-u-display--none');
      }, 5000);
    };
  }
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
export default () => {
  document.addEventListener('DOMContentLoaded', displayTranslationLink);
  document.addEventListener('DOMContentLoaded', configureSharableLink);
};
