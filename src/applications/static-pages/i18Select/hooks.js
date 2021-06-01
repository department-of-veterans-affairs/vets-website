const onThisPageDict = {
  es: { onThisPage: 'En esta página' },
  tl: {
    onThisPage: 'Sa pahinang ito',
  },
};

export const onThisPageHook = lang => {
  if (lang && lang !== 'en') {
    const onThisPageEl = document?.getElementById('on-this-page');
    if (onThisPageEl) {
      onThisPageEl.innerText = onThisPageDict[lang].onThisPage;
    }
  }
};

export const setLangAttribute = lang => {
  const contentDiv = document?.getElementById('content');
  if (contentDiv) {
    contentDiv.setAttribute('lang', lang);
  }
};

// set lang code as `en` for all links on the current page
// unless it follows the old IA lang patterns or already has a lang attribute
// without overwriting existing onclick events
// reference: https://stackoverflow.com/questions/891989/javascript-adding-an-onclick-handler-without-overwriting-the-existing-one

export const adaptLinksWithLangCode = setLangAttributeInReduxStore => {
  const links = document.links;
  for (const link of links) {
    link.addEventListener('click', () => {
      setLangAttributeInReduxStore('en');
      const langAttribute = link.hreflang || link.lang;
      if (langAttribute) {
        setLangAttributeInReduxStore(langAttribute);
      }
      // respect the temp IA i18 structure
      if (link.href.endsWith('-esp/')) {
        setLangAttributeInReduxStore('es');
      }
      if (link.href.endsWith('-tag/')) {
        setLangAttributeInReduxStore('tl');
      }
    });
  }
};
