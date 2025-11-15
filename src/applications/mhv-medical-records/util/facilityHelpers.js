/**
 * Formats an array of facility names into a grammatically correct string.
 * Handles comma placement and "and" conjunction for multiple facilities.
 *
 * @param {Array<string>} facilities - Array of facility names
 * @returns {string} Formatted facility list
 *
 * Examples:
 * - 1 facility: "VA Western New York health care"
 * - 2 facilities: "VA Western New York health care and VA Pacific Islands health care"
 * - 3+ facilities: "VA Western New York health care, VA Pacific Islands health care, and VA Central Ohio health care"
 */
export const formatFacilityList = facilities => {
  if (!facilities || facilities.length === 0) return '';
  if (facilities.length === 1) return facilities[0];
  if (facilities.length === 2) return `${facilities[0]} and ${facilities[1]}`;

  // For 3+ facilities: "A, B, and C"
  const allButLast = facilities.slice(0, -1).join(', ');
  const last = facilities[facilities.length - 1];
  return `${allButLast}, and ${last}`;
};
