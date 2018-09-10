import isBrandConsolidationEnabled from './feature-flag';

export const DEV_PREVIEW_VA_DOMAIN = 'dev-preview.va.gov';
export const PREVIEW_VA_DOMAIN = 'preview.va.gov';
export const PRODUCTION_VA_DOMAIN = 'www.va.gov';

export default {
  isEnabled() {
    return isBrandConsolidationEnabled();
  },

  isDevPreview() {
    return document.location.hostname === DEV_PREVIEW_VA_DOMAIN;
  },

  isPreview() {
    return document.location.hostname === PREVIEW_VA_DOMAIN;
  },

  isProduction() {
    return document.location.hostname === PRODUCTION_VA_DOMAIN;
  }
};
