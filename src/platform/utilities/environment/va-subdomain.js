/**
 * Returns whether the current hostname is a VA subdomain
 * @returns {boolean}
 * @module platform/brand-consolidation/va-subdomain
 */
export default function isVATeamSiteSubdomain() {
  return (
    !window.location.hostname.match(/(www|staging|dev).va.gov/gi) &&
    !window.location.hostname.match(/(localhost|127.0.0.1)/gi)
  );
}
