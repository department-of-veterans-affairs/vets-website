import React from 'react';

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
