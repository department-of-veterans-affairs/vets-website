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
  for (let i = 0; i !== links.length; i++) {
    links[i].onclick = (function() {
      const origOnClick = links[i].onclick;
      return function() {
        if (origOnClick != null && !origOnClick()) {
          return false;
        }
        // the link already has the appropriate lang attribute, do nothing
        if (links[i].hreflang) return true;
        // respect the temp IA i18 structure
        if (
          !links[i].href.endsWith('-esp/') &&
          !links[i].href.endsWith('-tag/')
        ) {
          setLangAttributeInReduxStore('en');
        }
        return true;
      };
    })();
  }
};
