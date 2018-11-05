/**
 * Returns whether the current hostname is a VA subdomain
 * @returns {boolean}
 * @module platform/brand-consolidation/va-subdomain
 */
export default function isVASubdomain() {
  return !!window.location.hostname.match(
    /(cem|benefits|telehealth|volunteer|ptsd|nutrition).va/gi,
  );
}
