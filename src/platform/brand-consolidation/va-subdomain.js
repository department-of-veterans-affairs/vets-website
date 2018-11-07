/**
 * Returns whether the current hostname is a VA subdomain
 * @returns {boolean}
 * @module platform/brand-consolidation/va-subdomain
 */
export default function isVATeamSiteSubdomain() {
  return !!window.location.hostname.match(
    /(cem|choose|benefits|telehealth|volunteer|ptsd|nutrition).va/gi,
  );
}
