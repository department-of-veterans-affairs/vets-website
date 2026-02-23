import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import eng from './eng.json';

const i18nCombinedDebtPortal = createInstance();

i18nCombinedDebtPortal.use(initReactI18next).init({
  resources: {
    en: eng,
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'combined-debt-portal',
  interpolation: {
    escapeValue: false,
  },
  react: {
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['strong', 'em', 'br'],
  },
});

export default i18nCombinedDebtPortal;
