import {
  DEFAULT_LANGUAGE,
  TRANSLATED_LANGUAGES,
  ALL_LANGUAGES,
  PATHNAME_DICT,
} from './constants';

export function stripTrailingSlash(str) {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}

export const getConfigFromLanguageCode = languageCode => {
  return (
    ALL_LANGUAGES.find(language => language.code === languageCode) ||
    DEFAULT_LANGUAGE
  );
};

// used on page load to find translation links relating to document.location.pathname
export const getPageTypeFromPathname = pathname => {
  return PATHNAME_DICT?.[stripTrailingSlash(pathname)]?.pageType ?? null;
};

const getLinksInSelector = selector => {
  const container = document?.querySelector(selector);

  const links = container?.getElementsByTagName('a');

  if (!container || !links) return [null, null];

  return [container, links];
};

export const setOnThisPageText = languageCode => {
  if (!languageCode || languageCode === 'en') return;

  const onThisPageEl = document?.getElementById('on-this-page');

  if (!onThisPageEl) return;

  onThisPageEl.innerText = getConfigFromLanguageCode(languageCode).onThisPage;
};

const setMedalliaSurveyLangOnWindow = languageCode => {
  if (!languageCode) return;

  window.medalliaSurveyLanguage = languageCode;
};

// derive a language by pattern matching the url pathname
// drupal based urls will have a suffix attached (e.g., -esp, -tag)
// links may have included words that indicate language (e.g., espanol.cdc.gov)
// this can be used for the href of a link or the current document url
// TODO: add better pattern matching, lang attr set directly in cms content for anchors if possible
export const getConfigFromUrl = (url, languages) => {
  return languages.reduce((accumulator, languageConfig) => {
    const {
      urlPatterns: { included = [], suffixed = [] },
    } = languageConfig;

    const parsedUrlPatternResults = [
      ...included.map(
        includedTerm => includedTerm && url?.includes(includedTerm),
      ),
      ...suffixed.map(
        suffixedTerm => suffixedTerm && url?.endsWith(suffixedTerm),
      ),
    ];

    return parsedUrlPatternResults.includes(true)
      ? languageConfig
      : accumulator;
  }, DEFAULT_LANGUAGE);
};

const adaptContentWithLangCode = langCode => {
  // the article.content-usa element is the main translated content,
  // so it should have it's lang attribute set
  // TODO: improve selector for this if possible
  const [container, links] = getLinksInSelector('article.usa-content');

  if (!container) return;

  container.setAttribute('lang', langCode);

  if (!links || links.length === 0) return;

  for (const link of links) {
    // we only want to set the hreflang on valid links
    // excluding jumplinks and telephone links
    if (link && !link.href.includes('#') && !link.href.includes('tel')) {
      const { code } = getConfigFromUrl(link.href, TRANSLATED_LANGUAGES);

      link.setAttribute('hreflang', code);
    }
  }
};

const adaptSidebarWithLangCode = () => {
  const [container, links] = getLinksInSelector('#va-detailpage-sidebar');

  if (!container || !links) return;

  for (const link of links) {
    // we only want to set the hreflang to valid links
    // this excludes jumplinks and telephone links
    if (link && !link.href.includes('#') && !link.href.includes('tel')) {
      const { code } = getConfigFromUrl(link.href, TRANSLATED_LANGUAGES);

      // sidebar links are considered to be translated to their target language,
      // and therefore would have their hreflang and lang set to their parsed language
      if (code !== 'en') {
        link.setAttribute('hreflang', code);
        link.setAttribute('lang', code);
      }
    }
  }
};

const adaptBreadcrumbWithLangCode = langCode => {
  const [container, links] = getLinksInSelector('#va-breadcrumbs-list');

  if (!container || !links) return;

  for (const link of links) {
    // we only want to set the lang on breadcrumb for aria-current="page"
    const ariaCurrent = link?.getAttribute('aria-current');

    if (link && ariaCurrent && ariaCurrent === 'page') {
      link.setAttribute('lang', langCode);
    }
  }
};

export const setLangAttributes = lang => {
  adaptContentWithLangCode(lang);
  adaptBreadcrumbWithLangCode(lang);
  adaptSidebarWithLangCode();
  setMedalliaSurveyLangOnWindow(lang);
};
