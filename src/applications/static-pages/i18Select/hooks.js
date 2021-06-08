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
  if (url.includes(`espanol`)) {
    langCode = 'es';
  }
  if (url.includes(`tagalog`)) {
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
      // assumption: any link to translated content has its own hreflang or lang attribute, which is preserved,
      // and can differ from the lang attribute on div#content

      link.addEventListener('click', () => {
        const langAttribute = link.lang || link.hreflang;
        if (link.href.endsWith('-esp/') || parseLangCode(link.href) === 'es') {
          return setLangAttributeInReduxStore('es');
        }
        if (link.href.endsWith('-tag/') || parseLangCode(link.href) === 'tl') {
          return setLangAttributeInReduxStore('tl');
        }
        if (langAttribute) {
          return setLangAttributeInReduxStore(langAttribute);
        } else {
          link.setAttribute('lang', 'en');
          return setLangAttributeInReduxStore('en');
        }
      });
    }
  }
};
