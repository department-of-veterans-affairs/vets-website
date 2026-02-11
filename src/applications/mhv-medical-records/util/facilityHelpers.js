import React from 'react';

/**
 * @typedef {Object} FacilityCutoverInfo
 * @property {string} facilityName - The official name of the VA facility
 * @property {string} facilityAliasName - The commonly used alias name for the facility
 * @property {string} facilityLocation - The city and state where the facility is located
 * @property {string} facilityId - The unique identifier for the facility (format: VHA_XXX)
 * @property {string} cutoverDate - The date when the facility transitioned to Oracle Health
 */

/**
 * Array of VA facilities that have transitioned (or will transition) to Oracle Health (Cerner).
 * Contains facility metadata including names, locations, IDs, and cutover dates.
 *
 * @constant {Array<FacilityCutoverInfo>}
 */
const FACILITY_CUTOVER_OBJECT = [
  {
    facilityName: 'Mann-Grandstaff VA Medical Center',
    facilityAliasName: 'VA Spokane health care',
    facilityLocation: 'Spokane, WA',
    facilityId: 'VHA_668',
    cutoverDate: 'October 24, 2020',
  },
  {
    facilityName: 'Jonathan M. Wainwright Memorial VA Medical Center',
    facilityAliasName: 'VA Walla Walla health care',
    facilityLocation: 'Walla Walla, WA',
    facilityId: 'VHA_687',
    cutoverDate: 'March 26, 2022',
  },
  {
    facilityName: 'VA Central Ohio Health Care System',
    facilityAliasName: 'VA Central Ohio health care',
    facilityLocation: 'Columbus, OH',
    facilityId: 'VHA_757',
    cutoverDate: 'April 30, 2022',
  },
  {
    facilityName: 'Roseburg VA Health Care System',
    facilityAliasName: 'VA Roseburg health care',
    facilityLocation: 'Roseburg, OR',
    facilityId: 'VHA_653',
    cutoverDate: 'June 11, 2022',
  },
  {
    facilityName: 'VA Southern Oregon Rehabilitation Center and Clinics',
    facilityAliasName: 'VA Southern Oregon health care',
    facilityLocation: 'White City, OR',
    facilityId: 'VHA_692',
    cutoverDate: 'June 11, 2022',
  },
  {
    facilityName: 'Captain James A. Lovell Federal Health Care Center',
    facilityAliasName: 'Lovell Federal health care - VA',
    facilityLocation: 'Chicago, IL',
    facilityId: 'VHA_556',
    cutoverDate: 'March 9, 2024',
  },
  {
    facilityName: 'VA Detroit Healthcare System',
    facilityAliasName: 'VA Detroit health care',
    facilityLocation: 'Detroit, MI',
    facilityId: 'VHA_553',
    cutoverDate: 'April 11, 2026',
  },
  {
    facilityName: 'VA Saginaw Healthcare System',
    facilityAliasName: 'VA Saginaw health care',
    facilityLocation: 'Saginaw, MI',
    facilityId: 'VHA_655',
    cutoverDate: 'April 11, 2026',
  },
  {
    facilityName: 'VA Ann Arbor Healthcare System',
    facilityAliasName: 'VA Ann Arbor health care',
    facilityLocation: 'Ann Arbor, MI',
    facilityId: 'VHA_506',
    cutoverDate: 'April 11, 2026',
  },
  {
    facilityName: 'VA Battle Creek Medical Center',
    facilityAliasName: 'VA Battle Creek health care',
    facilityLocation: 'Battle Creek, MI',
    facilityId: 'VHA_515',
    cutoverDate: 'April 11, 2026',
  },
];

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
 * Creates a JSX fragment with the facility name followed by the cutover date in bold.
 *
 * @param {string} facilityName - The name of the facility
 * @param {string} cutoverDate - The cutover date to display in bold
 * @returns {JSX.Element} JSX fragment with facility name and bolded cutover date
 *
 * @example
 * // Returns: VA Detroit health care <strong>(April 11, 2026)</strong>
 * facilityNameAndBoldDate('VA Detroit health care', 'April 11, 2026')
 */
const facilityNameAndBoldDate = (facilityName, cutoverDate) => {
  return (
    <>
      {facilityName} <strong>({cutoverDate})</strong>
    </>
  );
};

/**
 * Formats a facility name with its cutover date from the FACILITY_CUTOVER_OBJECT.
 * Looks up the facility by name and appends the cutover date in parentheses.
 *
 * @param {string} facilityName - The name of the facility to format
 * @returns {JSX.Element} The facility name with cutover date appended, or the original name if not found
 *
 * @example
 * // Returns facility name with cutover date
 * formatFacilityWithCutoverDate('VA Detroit Healthcare System')
 * // 'VA Detroit Healthcare System (April 11, 2026)'
 *
 * @example
 * // Returns original name if facility not found in FACILITY_CUTOVER_OBJECT
 * formatFacilityWithCutoverDate('Unknown Facility')
 * // 'Unknown Facility'
 */
const formatFacilityWithCutoverDate = facilityName => {
  const facilityInfo = FACILITY_CUTOVER_OBJECT.find(
    facility => facility.facilityAliasName === facilityName,
  );
  if (!facilityInfo) return facilityName; // Return original name if not found
  // return `${facilityName} (${facilityInfo.cutoverDate})`;
  return facilityNameAndBoldDate(facilityName, facilityInfo.cutoverDate);
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
export const formatFacilityUnorderedListWithCutoverDate = facilities => {
  if (!facilities || facilities.length === 0) return '';
  return (
    <ul>
      {facilities.map(facility => (
        <li key={facility}>{formatFacilityWithCutoverDate(facility)}</li>
      ))}
    </ul>
  );
};

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
export const formatFacilityListWithCutoverDate = facilities => {
  if (!facilities || facilities.length === 0) return '';
  if (facilities.length === 1)
    return formatFacilityWithCutoverDate(facilities[0]);
  if (facilities.length === 2)
    return `${formatFacilityWithCutoverDate(
      facilities[0],
    )} and ${formatFacilityWithCutoverDate(facilities[1])}`;

  // For 3+ facilities: "A, B, and C"
  const allButLast = facilities
    ?.slice(0, -1)
    .map((facility, index) => {
      return index === 0
        ? formatFacilityWithCutoverDate(facility)
        : `, ${formatFacilityWithCutoverDate(facility)}`;
    })
    .join('');
  const lastFacility = facilities[facilities.length - 1];
  return `${allButLast}, and ${formatFacilityWithCutoverDate(lastFacility)}`;
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
