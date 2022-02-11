import {
  DEFAULT_LANGUAGE,
  TRANSLATED_LANGUAGES,
  ALL_LANGUAGES,
  PATHNAME_DICT,
} from './constants';

import URLS from './urls';

export function stripTrailingSlash(str) {
  return str?.endsWith('/') ? str?.slice(0, -1) : str || '';
}

export const getConfigFromLanguageCode = languageCode =>
  ALL_LANGUAGES.find(language => language.code === languageCode) ||
  DEFAULT_LANGUAGE;

// used on page load to find translation links relating to document.location.pathname
export const getPageTypeFromPathname = pathname =>
  PATHNAME_DICT?.[stripTrailingSlash(pathname)]?.pageType ?? null;

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
export const getConfigFromUrl = (url, languages) =>
  languages.reduce((accumulator, languageConfig) => {
    const {
      urlPatterns: { included = [], suffixed = [] },
    } = languageConfig;

    const parsedUrlPatternResults = [
      ...included.map(
        includedTerm =>
          includedTerm && url?.toLowerCase()?.includes(includedTerm),
      ),
      ...suffixed.map(
        suffixedTerm =>
          suffixedTerm && url?.toLowerCase()?.endsWith(suffixedTerm),
      ),
    ];

    return parsedUrlPatternResults.includes(true)
      ? languageConfig
      : accumulator;
  }, DEFAULT_LANGUAGE);

const adaptWithLangCode = (
  langCode,
  selector,
  attributesToSet = ['hreflang', 'lang'],
  setContainerAttribute = false,
) => {
  const [container, links] = getLinksInSelector(selector);

  if (!container) return;

  if (setContainerAttribute) container.setAttribute('lang', langCode);

  if (!links || links.length === 0) return;

  for (const link of links) {
    // we only want to set the hreflang on valid links
    // excluding jumplinks and telephone links
    if (link && !link.href.includes('#') && !link.href.includes('tel')) {
      const { code } = getConfigFromUrl(link.href, TRANSLATED_LANGUAGES);

      for (const attribute of attributesToSet) {
        link.setAttribute(attribute, code);
      }
    }
  }
};

export const setLangAttributes = lang => {
  // adapt content section
  adaptWithLangCode(lang, 'article.usa-content', ['hreflang'], true);

  // adapt breadcrumb links
  adaptWithLangCode(lang, '#va-breadcrumbs-list', ['lang']);

  // adapt sidebar links
  adaptWithLangCode(lang, '#va-detailpage-sidebar');

  setMedalliaSurveyLangOnWindow(lang);
};

export const getNonActiveLinkUrls = languageCode => {
  return Object.values(URLS).reduce((acc1, item) => {
    const links = Object.entries(item).reduce((acc2, [key, value]) => {
      if (key !== languageCode) return [...acc2, value];
      return acc2;
    }, []);

    if (links?.length > 0) return [...acc1, ...links];
    return acc1;
  }, []);
};

export const adjustSidebarNav = lang => {
  const sideNav = document?.querySelector('#va-detailpage-sidebar');

  if (!sideNav) return;

  const links = Array.from(sideNav?.getElementsByTagName('a'));

  const nonActiveLinkUrls = getNonActiveLinkUrls(lang);

  nonActiveLinkUrls?.forEach(url => {
    links?.forEach(link => {
      if (stripTrailingSlash(link?.href)?.endsWith(stripTrailingSlash(url))) {
        link?.parentNode.remove();
      }
    });
  });
};
