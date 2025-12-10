import React from 'react';

/**
 * Formats an array of facility names into an unordered List of facility names.
 *
 *
 * @param {Array<string>} facilities - Array of facility names
 * @returns {Element} Formatted as an unordered list of facility names
 *
 * Examples:
 * - 1 facility: "VA Western New York health care"
 * - 2 facilities: "VA Western New York health care and VA Pacific Islands health care"
 * - 3+ facilities: "VA Western New York health care, VA Pacific Islands health care, and VA Central Ohio health care"
 */
export const formatFacilityUnorderedList = facilities => {
  if (!facilities || facilities.length === 0) return '';
  return (
    <ul>
      {facilities.map((facility, index) => (
        <li key={index}>{facility}</li>
      ))}
    </ul>
  );
};
