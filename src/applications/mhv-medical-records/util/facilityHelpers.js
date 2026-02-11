import React from 'react';
import { NONE_RECORDED } from './constants';
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
 * @param {Array<string|{id: string, content: JSX.Element|string}>} facilities - Array of facility names (strings) or objects with id and content
 * @returns {JSX.Element|string} Formatted as an unordered list of facility names, or NONE_RECORDED if no facilities
 *
 * @example
 * // Returns NONE_RECORDED for empty/null array
 * formatFacilityUnorderedList([]) // 'None recorded'
 * formatFacilityUnorderedList(null) // 'None recorded'
 *
 * @example
 * // Returns JSX unordered list for array with items
 * formatFacilityUnorderedList(['VA Western New York health care'])
 * // <ul>
 * //   <li>VA Western New York health care</li>
 * // </ul>
 *
 * @example
 * // Supports objects with id and content for unique keys
 * formatFacilityUnorderedList([{ id: '757', content: 'VA Central Ohio health care' }])
 */
export const formatFacilityUnorderedList = facilities => {
  if (!facilities || facilities.length === 0) return NONE_RECORDED;
  return (
    <ul>
      {facilities.map((facility, index) => {
        // Handle both string items and object items with id/content
        const isObject =
          typeof facility === 'object' && facility !== null && 'id' in facility;
        const key = isObject ? facility.id : `facility-${index}`;
        const content = isObject ? facility.content : facility;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <li key={key}>{content}</li>
        );
      })}
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
 * @returns {Array<{id: string, content: JSX.Element|string}>} Array of objects with facility ID and content (name with bolded "before [date]" suffix for transitioned facilities)
 */
export const createBeforeCutoverFacilityNames = (
  ohFacilities,
  ehrDataByVhaId,
  transitionTable,
  getNameFn,
) => {
  if (!ehrDataByVhaId || !ohFacilities) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return ohFacilities
    .map(facility => {
      const name = getNameFn(ehrDataByVhaId, facility.facilityId);
      if (!name) return null;

      const transitionData = transitionTable[facility.facilityId];
      if (transitionData) {
        const cutoverDate = new Date(`${transitionData.cutoverDate}T00:00:00`);
        // Only append suffix if cutover date is current date or older
        if (cutoverDate <= today) {
          const formattedDate = formatCutoverDate(transitionData.cutoverDate);
          return {
            id: `${facility.facilityId}-before`,
            content: (
              <>
                {name} <strong>(before {formattedDate})</strong>
              </>
            ),
          };
        }
      }
      return { id: facility.facilityId, content: name };
    })
    .filter(item => item);
};

/**
 * Creates an array of facility names with "[cutover date] - present" appended
 * for facilities in the transition table. The date portion is bolded.
 *
 * @param {Array<Object>} ohFacilities - Array of OH facility objects with facilityId property
 * @param {Object} ehrDataByVhaId - EHR data mapping for facility name lookup
 * @param {Object} transitionTable - Mapping of facility IDs to cutover dates
 * @param {Function} getNameFn - Function to get facility name from EHR data
 * @returns {Array<{id: string, content: JSX.Element|string}>} Array of objects with facility ID and content (name with bolded "[date] - present" suffix for transitioned facilities)
 */
export const createAfterCutoverFacilityNames = (
  ohFacilities,
  ehrDataByVhaId,
  transitionTable,
  getNameFn,
) => {
  if (!ehrDataByVhaId || !ohFacilities) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return ohFacilities
    .map(facility => {
      const name = getNameFn(ehrDataByVhaId, facility.facilityId);
      if (!name) return null;

      const transitionData = transitionTable[facility.facilityId];
      if (transitionData) {
        const cutoverDate = new Date(`${transitionData.cutoverDate}T00:00:00`);
        // Only append suffix if cutover date is current date or older
        if (cutoverDate <= today) {
          const formattedDate = formatCutoverDate(transitionData.cutoverDate);
          return {
            id: `${facility.facilityId}-after`,
            content: (
              <>
                {name}{' '}
                <strong>
                  ({formattedDate}
                  -present)
                </strong>
              </>
            ),
          };
        }
      }
      return { id: facility.facilityId, content: name };
    })
    .filter(item => item);
};
