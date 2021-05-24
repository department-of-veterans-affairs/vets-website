export const onThisPageHook = (content, lang) => {
  if (lang && lang !== 'en') {
    const onThisPageEl = document?.getElementById('on-this-page');
    onThisPageEl.innerText = content[lang].onThisPage;
  }
};

export const setLangAttribute = lang => {
  const contentDiv = document?.getElementById('content');
  if (contentDiv) {
    contentDiv.setAttribute('lang', lang);
  }
};

// set lang code as `en` for all links on the current page
// unless it follows the old IA lang patterns
// without overwriting existing onclick events
// reference: https://stackoverflow.com/questions/891989/javascript-adding-an-onclick-handler-without-overwriting-the-existing-one

export const adaptLinksWithLangCode = setLangAttributeInReduxStore => {
  const links = document.links;
  for (const link of links) {
    link.onclick = (function() {
      const origOnClick = link.onclick;
      return function() {
        if (origOnClick != null && !origOnClick()) {
          return false;
        }
        // the link already has the appropriate lang attribute, do nothing
        if (link.hreflang) return true;
        // respect the temp IA i18 structure
        if (link.href.endsWith('-esp/')) {
          setLangAttributeInReduxStore('es');
          return true;
        }
        if (link.href.endsWith('-tag/')) {
          setLangAttributeInReduxStore('tl');
          return true;
        }
        setLangAttributeInReduxStore('en');
        return true;
      };
    })();
  }
};
