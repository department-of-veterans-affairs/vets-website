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

/**
 * Formats a cutover date into a readable string (e.g., "October 24, 2020").
 *
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string (e.g., "October 24, 2020")
 */
export const formatCutoverDate = dateString => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Creates an array of facility names with "before [cutover date]" appended
 * for facilities in the transition table. The date portion is bolded.
 *
 * @param {Array<Object>} ohFacilities - Array of OH facility objects with facilityId property
 * @param {Object} ehrDataByVhaId - EHR data mapping for facility name lookup
 * @param {Object} transitionTable - Mapping of facility IDs to cutover dates
 * @param {Function} getNameFn - Function to get facility name from EHR data
 * @returns {Array<JSX.Element|string>} Array of facility names with bolded "before [date]" suffix for transitioned facilities
 */
export const createBeforeCutoverFacilityNames = (
  ohFacilities,
  ehrDataByVhaId,
  transitionTable,
  getNameFn,
) => {
  if (!ehrDataByVhaId || !ohFacilities) return [];

  return ohFacilities
    .map(facility => {
      const name = getNameFn(ehrDataByVhaId, facility.facilityId);
      if (!name) return null;

      const transitionData = transitionTable[facility.facilityId];
      if (transitionData) {
        const formattedDate = formatCutoverDate(transitionData.cutoverDate);
        return (
          <>
            {name} <strong>(before {formattedDate})</strong>
          </>
        );
      }
      return name;
    })
    .filter(name => name);
};

/**
 * Creates an array of facility names with "[cutover date] - present" appended
 * for facilities in the transition table. The date portion is bolded.
 *
 * @param {Array<Object>} ohFacilities - Array of OH facility objects with facilityId property
 * @param {Object} ehrDataByVhaId - EHR data mapping for facility name lookup
 * @param {Object} transitionTable - Mapping of facility IDs to cutover dates
 * @param {Function} getNameFn - Function to get facility name from EHR data
 * @returns {Array<JSX.Element|string>} Array of facility names with bolded "[date] - present" suffix for transitioned facilities
 */
export const createAfterCutoverFacilityNames = (
  ohFacilities,
  ehrDataByVhaId,
  transitionTable,
  getNameFn,
) => {
  if (!ehrDataByVhaId || !ohFacilities) return [];

  return ohFacilities
    .map(facility => {
      const name = getNameFn(ehrDataByVhaId, facility.facilityId);
      if (!name) return null;

      const transitionData = transitionTable[facility.facilityId];
      if (transitionData) {
        const formattedDate = formatCutoverDate(transitionData.cutoverDate);
        return (
          <>
            {name} <strong>({formattedDate} - present)</strong>
          </>
        );
      }
      return name;
    })
    .filter(name => name);
};
