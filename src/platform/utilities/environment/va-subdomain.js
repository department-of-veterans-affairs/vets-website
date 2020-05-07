/**
 * Returns whether the current hostname is a VA subdomain
 * @returns {boolean}
 * @module platform/brand-consolidation/va-subdomain
 */
export default function isVATeamSiteSubdomain() {
  return !!window.location.hostname.match(
    /(benefits|cem|choose|ethics|healthquality|hepatitis|hiv|mentalhealth|move|nutrition|oedca|oefoif|oprm|osp|patientcare|patientsafety|polytrauma|ptsd|publichealth|ruralhealth|sci|telehealth|vetcenter|volunteer).va/gi,
  );
}
