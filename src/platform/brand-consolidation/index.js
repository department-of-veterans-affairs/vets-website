import isBrandConsolidationEnabled from './feature-flag';

export const PREVIEW_VA_DOMAIN = 'preview.va.gov';
export const PRODUCTION_VA_DOMAIN = 'www.va.gov';

export default {
  isEnabled() {
    return isBrandConsolidationEnabled();
  },

  isPreview() {
    return document.location.hostname === PREVIEW_VA_DOMAIN;
  },

  isProduction() {
    return document.location.hostname === PRODUCTION_VA_DOMAIN;
  },
};
