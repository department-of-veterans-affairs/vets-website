/**
 * Returns whether the current Webpack build is executing as the brand-consolidation of Vets.gov/VA.gov.
 * @returns {boolean}
 * @module platform/brand-consolidation/feature-flag
 */
export default function isBrandConsolidationEnabled() {
  return window.settings.brandConsolidationEnabled;
}
