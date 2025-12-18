import React from 'react';

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

/**
 * Formats an array of facility names into an unordered list of facility names.
 *
 * @param {Array<string>} facilities - Array of facility names
 * @returns {JSX.Element|string} Formatted as an unordered list of facility names, or empty string if no facilities
 *
 * @example
 * // Returns empty string for empty/null array
 * formatFacilityUnorderedList([]) // ''
 * formatFacilityUnorderedList(null) // ''
 *
 * @example
 * // Returns JSX unordered list for array with items
 * formatFacilityUnorderedList(['VA Western New York health care'])
 * // <ul>
 * //   <li>VA Western New York health care</li>
 * // </ul>
 *
 * @example
 * // Multiple facilities
 * formatFacilityUnorderedList(['VA Western New York health care', 'VA Pacific Islands health care'])
 * // <ul>
 * //   <li>VA Western New York health care</li>
 * //   <li>VA Pacific Islands health care</li>
 * // </ul>
 */
export const formatFacilityUnorderedList = facilities => {
  if (!facilities || facilities.length === 0) return '';
  return (
    <ul>
      {facilities.map(facility => (
        <li key={facility}>{facility}</li>
      ))}
    </ul>
  );
};
