/**
 * Returns whether the current Webpack build is executing as the brand-consolidation of Vets.gov/VA.gov.
 * Since this is driven by the window.settings, rather than state, you should prefer to use the containers instead.
 * @returns {boolean}
 * @module platform/brand-consolidation/feature-flag
 */
export default function isBrandConsolidationEnabled() {
  return window.settings.brandConsolidation.enabled;
}
