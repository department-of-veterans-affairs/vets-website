export const BASE_URLS = {
  faq: {
    en: '/coronavirus-veteran-frequently-asked-questions/',
    es: '/coronavirus-veteran-frequently-asked-questions-esp/',
    tl: '/coronavirus-veteran-frequently-asked-questions-tag/',
  },
  vaccine: {
    en: '/health-care/covid-19-vaccine/',
    es: '/health-care/covid-19-vaccine-esp/',
    tl: '/health-care/covid-19-vaccine-tag/',
  },
};

export const TRANSLATABLE_LINKS = new Set(
  Object.values(BASE_URLS).reduce((accumulator, links) => {
    return accumulator.concat(Object.values(links));
  }, []),
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
      included: ['espanol'],
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
