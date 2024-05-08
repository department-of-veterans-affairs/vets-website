import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { isDate } from 'date-fns';
import { format as formatDate } from 'date-fns-tz';
import { enUS as en, es } from 'date-fns/locale';
import { get } from 'lodash';
import enTranslation from '../../locales/en/translation.json';
import esTranslation from '../../locales/es/translation.json';
import tlTranslation from '../../locales/tl/translation.json';

/**
 * Helper function to set language on main element for DS component detection.
 *
 * @param {string} language
 */
const setPageLanguage = language => {
  document.getElementById('main')?.setAttribute('lang', language);
};

const locales = { en, es };

/**
 * Interpolators for date formatting.
 */
export const dateFormatInterpolators = {
  long: (value, _format, lng, locale) => {
    return lng.startsWith('es')
      ? formatDate(value, "dd 'de' MMMM 'de' yyy", { locale })
      : formatDate(value, 'MMMM dd, yyyy', { locale });
  },
  longAtTime: (value, _format, _lng, locale) => {
    let dateString = formatDate(value, 'PPPppp', { locale });
    // Remove date suffixes. (1st/2nd/etc.)
    dateString = dateString.replace(/([0-9]{1,2})([a-z]{2})(, )/, '$1$3');
    // Adjust am/pm formatting.
    dateString = dateString.replace(/:[0-9]{2} AM .*$/, ' a.m.');
    dateString = dateString.replace(/:[0-9]{2} PM .*$/, ' p.m.');
    return dateString;
  },
  mdY: (value, _format, lng, _locale) => {
    return lng.startsWith('es')
      ? formatDate(value, 'dd/M/Y')
      : formatDate(value, 'MM/dd/Y');
  },
  time: (value, _format, _lng, locale) => {
    return formatDate(value, 'h:mm aaaa', { locale });
  },
  day: (value, _format, _lng, locale) => {
    return formatDate(value, 'EEEE', { locale });
  },
  monthDay: (value, _format, _lng, locale) => {
    return formatDate(value, 'MMMM d', { locale });
  },
  dayOfWeekAbbr: (value, _format, _lng, locale) => {
    return formatDate(value, 'E', { locale });
  },
  monthAndYear: (value, _format, _lng, locale) => {
    return formatDate(value, 'MMMM Y', { locale });
  },
  dayOfMonth: (value, _format, _lng, locale) => {
    return formatDate(value, 'd', { locale });
  },
  dayWithTime: (value, _format, _lng, locale) => {
    return formatDate(value.date, 'MMMM dd, yyyy, h:mm aaaa', {
      locale,
      timeZone: value.timezone,
    });
  },
  date: (value, _format, _lng, locale) => {
    return formatDate(value, 'E, MMMM do', { locale });
  },
  default: (value, format, _lng, locale) => {
    return formatDate(value, format, { locale });
  },
};

const i18nOptions = {
  detection: {
    order: ['localStorage', 'sessionStorage', 'navigator'],
    lookupLocalStorage: 'checkin-i18nextLng',
    lookupSessionStorage: 'checkin-i18nextLng',
  },
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
    format: (value, format, lng) => {
      if (isDate(value) || isDate(value?.date)) {
        const locale = locales[lng];
        const interpolator = get(
          dateFormatInterpolators,
          format,
          dateFormatInterpolators.default,
        );
        return interpolator(value, format, lng, locale);
      }
      if (format === 'capitalize') {
        return `${value.substr(0, 1).toUpperCase()}${value.substr(1)}`;
      }
      if (format === 'uncapitalize') {
        return `${value.substr(0, 1).toLowerCase()}${value.substr(1)}`;
      }
      return value;
    },
  },
  resources: {
    en: { translation: enTranslation },
    es: { translation: esTranslation },
    tl: { translation: tlTranslation },
  },
};

export const setupI18n = () => {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init(i18nOptions);

  // This is necessary for DS components to use our language preference on initial page load.
  i18n.on('languageChanged', language => {
    setPageLanguage(language);
  });

  return i18n;
};

setupI18n();

/**
 * Cleans up i18n setup to avoid interference between tests.
 */
export const teardownI18n = () => {
  i18n.off('languageChanged', setPageLanguage);
};
