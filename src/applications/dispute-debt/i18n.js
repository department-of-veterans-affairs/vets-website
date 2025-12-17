import { createInstance } from 'i18next';
import eng from './eng.json';

const i18nDebtApp = createInstance();

i18nDebtApp.init({
  resources: {
    en: {
      translation: eng,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18nDebtApp;
