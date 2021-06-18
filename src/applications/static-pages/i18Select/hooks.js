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
const setMedalliaSurveyLangOnWindow = lang => {
  if (lang) {
    window.medalliaSurveyLanguage = lang;
  }
};
export const setLangAttribute = lang => {
  const contentDiv = document?.getElementById('content');
  if (contentDiv) {
    contentDiv.setAttribute('lang', lang);
    setMedalliaSurveyLangOnWindow(lang);
  }
};

export const parseLangCode = url => {
  let langCode = 'en';
  // competing URL structures ¯\_(ツ)_/¯
  // also sometimes the href ends with `tag` instead `tag/`
  if (
    url.includes(`espanol`) ||
    url.endsWith('-esp/') ||
    url.endsWith('-esp')
  ) {
    langCode = 'es';
  }
  if (
    url.includes(`tagalog`) ||
    url.endsWith('-tag/') ||
    url.endsWith('-tag')
  ) {
    langCode = 'tl';
  }
  return langCode;
};

export const adaptLinksWithLangCode = (
  setLangAttributeInReduxStore,
  pageLangCode,
) => {
  const links = document.links;
  for (const link of links) {
    if (link) {
      let langAttribute = link.lang || link.hreflang;
      const correctLangAttribute = parseLangCode(link.href);

      if (!langAttribute) {
        langAttribute = pageLangCode;
        link.setAttribute('lang', pageLangCode);
      }

      if (correctLangAttribute !== link.lang) {
        langAttribute = correctLangAttribute;
        link.setAttribute('lang', langAttribute);
      }
      link.addEventListener('click', () => {
        setLangAttributeInReduxStore(langAttribute);
        setMedalliaSurveyLangOnWindow(langAttribute);
      });
    }
  }
};
