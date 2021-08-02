export const onThisPageDict = {
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

export const parseLangCode = url => {
  let langCode = 'en';
  if (!url) return langCode;
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

const adaptContentWithLangCode = langCode => {
  // the article.content-usa element is the main translated content,
  // so it should have it's lang attribute set
  // TODO: improve/change selector for this if possible
  const content = document?.querySelector('article.usa-content');

  if (!content) return;

  content.setAttribute('lang', langCode);

  // links should be parsed inside the article to potentially have lang attributes set
  const contentLinks = content?.getElementsByTagName('a');

  if (!contentLinks || contentLinks.length === 0) return;

  for (const link of contentLinks) {
    // we only want to set the hreflang to valid links
    // this excludes jumplinks and telephone links
    if (link && !link.href.includes('#') && !link.href.includes('tel')) {
      const linkTargetLanguage = parseLangCode(link.href);

      link.setAttribute('hreflang', linkTargetLanguage);
    }
  }
};

const adaptSidebarWithLangCode = () => {
  const sidebar = document?.getElementById('va-detailpage-sidebar');

  if (!sidebar) return;

  const sidebarLinks = sidebar?.getElementsByTagName('a');

  if (!sidebarLinks || sidebarLinks.length === 0) return;

  for (const link of sidebarLinks) {
    // we only want to set the hreflang to valid links
    // this excludes jumplinks and telephone links
    if (link && !link.href.includes('#') && !link.href.includes('tel')) {
      const linkTargetLanguage = parseLangCode(link.href);

      // sidebar links are considered to be tranlated to their target language,
      // and therefore would have their hreflang and lang set to the target language
      if (linkTargetLanguage !== 'en') {
        link.setAttribute('hreflang', linkTargetLanguage);
        link.setAttribute('lang', linkTargetLanguage);
      }
    }
  }
};

export const setLangAttribute = lang => {
  adaptContentWithLangCode(lang);
  adaptSidebarWithLangCode();
  setMedalliaSurveyLangOnWindow(lang);
};
