/**
 * Returns whether the current Webpack build is executing as the brand-consolidation of Vets.gov/VA.gov.
 * @returns {boolean}
 * @module platform/brand-consolidation/feature-flag
 */
export default function isBrandConsolidationEnabled() {

  // Properties defined on process.env are always parsed into a string. We're using Webpack,
  // however, so our process.env isn't a true Node process.env, so we can use booleans. The problem
  // though is that Mocha does use a true process.env, so false becomes 'false', and makes the unit
  // tests confusing. For consistency, the existence of BRAND_CONSOLIDATION_ENABLED evaluates to true.

  return process.env.BRAND_CONSOLIDATION_ENABLED !== undefined;
}
