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

export const parseLangCode = url => {
  let langCode = 'en';
  // competing URL structures ¯\_(ツ)_/¯
  if (url.includes(`espanol`) || url.endsWith('-esp/')) {
    langCode = 'es';
  }
  if (url.includes(`tagalog`) || url.endsWith('-tag/')) {
    langCode = 'tl';
  }
  return langCode;
};

export const adaptLinksWithLangCode = setLangAttributeInReduxStore => {
  const links = document.links;
  for (const link of links) {
    if (link) {
      // this sets the overall div#content `lang` to the intended lang when the user
      // clicks on a link with translated content
      // since the page refreshes on a link click (we aren't an SPA, and can't avail React Router here)
      // the lang code is preserved in local storage

      // assumption: any link to translated content has its own hreflang or lang attribute,
      // which is preserved
      // and can differ from the lang attribute on div#content

      link.addEventListener('click', () => {
        const langAttribute = link.lang || link.hreflang;
        if (langAttribute) {
          return setLangAttributeInReduxStore(langAttribute);
        } else {
          return setLangAttributeInReduxStore(parseLangCode(link.href));
        }
      });
    }
  }
};
