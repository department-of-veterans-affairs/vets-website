import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// import resourcesToBackend from 'i18next-resources-to-backend';
import en from '../../locales/en/translation.json';

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

    // Load only the english translation.
    // TODO: use resourcesToBackend to dynamically load all translations
    // once translations have been rolled out in production.
    resources: {
      en: { translation: en },
    },
  });

i18n.on('languageChanged', language => {
  document.getElementById('content').setAttribute('lang', language);
});

export default i18n;
