import BASE_URLS from './urls';
import { stripTrailingSlash } from './helpers';

export const PATHNAME_DICT = Object.entries(BASE_URLS).reduce(
  (accumulator, [pageType, languageObj]) => {
    Object.entries(languageObj).forEach(([code, slug]) => {
      accumulator[stripTrailingSlash(slug)] = {
        code,
        pageType,
      };
    });
    return accumulator;
  },
  {},
);

export const DEFAULT_LANGUAGE = {
  label: 'English',
  code: 'en',
  onThisPage: 'On this page',
};

export const TRANSLATED_LANGUAGES = [
  {
    label: 'Español',
    code: 'es',
    urlPatterns: {
      included: ['espanol', 'vacunas'],
      suffixed: ['-esp', '-esp/'],
    },
    onThisPage: 'En esta página',
  },
  {
    label: 'Tagalog',
    code: 'tl',
    urlPatterns: {
      included: ['tagalog'],
      suffixed: ['-tag', '-tag/'],
    },
    onThisPage: 'Sa pahinang ito',
  },
];

export const ALL_LANGUAGES = [DEFAULT_LANGUAGE, ...TRANSLATED_LANGUAGES];
