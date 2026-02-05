import { createInstance } from 'i18next';
import eng from './eng.json';

const i18nCombinedDebtPortal = createInstance();

i18nCombinedDebtPortal.init({
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

export default i18nCombinedDebtPortal;
