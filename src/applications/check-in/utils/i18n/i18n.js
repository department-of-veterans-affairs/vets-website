import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// import resourcesToBackend from 'i18next-resources-to-backend';
import { format as formatDate, isDate } from 'date-fns';
import { enUS as en, es } from 'date-fns/locale';
import enTranslation from '../../locales/en/translation.json';

const locales = { en, es };

i18n
  /*
  .use(
    resourcesToBackend((language, namespace, callback) => {
      import(`../../locales/${language}/${namespace}.json`)
        .then(resources => {
          callback(null, resources);
        })
        .catch(error => {
          callback(error, null);
        });
    }),
  )
  */
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      format: (value, format, lng) => {
        if (isDate(value)) {
          const locale = locales[lng];

          if (format === 'long') {
            return formatDate(value, 'MMMM dd, yyyy', { locale });
          }
          if (format === 'longAtTime') {
            return formatDate(value, 'PPPp', { locale });
          }
          if (format === 'mdY') {
            return formatDate(value, 'MM/dd/Y');
          }
          if (format === 'time') {
            return formatDate(value, 'h:mm aaaa', { locale });
          }

          return formatDate(value, format, { locale });
        }
        return value;
      },
    },
    // Load only the english translation.
    // TODO: use resourcesToBackend to dynamically load all translations
    // once translations have been rolled out in production.
    resources: {
      en: { translation: enTranslation },
    },
  });

i18n.on('languageChanged', language => {
  document.getElementById('content').setAttribute('lang', language);
});

export default i18n;
