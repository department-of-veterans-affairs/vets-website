import { endOfToday, isSameDay, isBefore } from 'date-fns';

import { parseStringOrDate } from 'platform/utilities/date';

import { ITF_STATUSES, ITF_SUPPORTED_BENEFIT_TYPES } from '../constants';

/**
 * Determine if a passed in date is expired. It returns true if the date is
 * before the end of today.
 * @param {Date|String} expirationDate
 * @returns {Boolean}
 */
export const isNotExpired = expirationDate => {
  if (!expirationDate) {
    return false;
  }
  const today = endOfToday();
  const expDate = parseStringOrDate(expirationDate);
  return isSameDay(today, expDate) || isBefore(today, expDate);
};

/**
 * @typedef {Object} GetIntentToFile
 * @property {GetItfDataObject} data - The intent to file data
 * @example
 * {
 *   "data": {
 *     "id": {},
 *     "type": "intent_to_file",
 *     "attributes": {
 *       "intentToFile": [
 *         {
 *           "id": "1",
 *           "creationDate": "2018-01-21T19:53:45.810+00:00",
 *           "expirationDate": "2018-02-21T19:53:45.810+00:00",
 *           "participantId": 1,
 *           "source": "EBN",
 *           "status": "expired",
 *           "type": "compensation"
 *         },
 *         {
 *           "id": "2",
 *           "creationDate": "2022-01-21T19:53:45.810+00:00",
 *           "expirationDate": "2023-02-21T19:53:45.810+00:00",
 *           "participantId": 1,
 *           "source": "EBN",
 *           "status": "active",
 *           "type": "compensation"
 *         }
 *       ],
 *     },
 *   }
 * }
 */
/**
 * @typedef {Object} GetItfDataObject
 * @property {String} id - Unique identifier
 * @property {String} type - ITF type (e.g., "intent_to_file")
 * @property {GetItfAttributeObject} attributes - ITF attributes
 */
/**
 * @typedef {Object} GetItfAttributeObject
 * @property {Array<ITFObject>} intentToFile - Array of intent to file objects
 */

/**
 * @typedef {Object} PostIntentToFile
 * @property {PostItfDataObject} data - The intent to file data
 * @example
 * {
 *   "data": {
 *     "id": {},
 *     "type": "intent_to_file",
 *     "attributes": {
 *       "intentToFile": {
 *         "id": "1",
 *         "creationDate": "2018-01-21T19:53:45.810+00:00",
 *         "expirationDate": "2018-02-21T19:53:45.810+00:00",
 *         "participantId": 1,
 *         "source": "EBN",
 *         "status": "active",
 *         "type": "compensation"
 *       }
 *     }
 *   }
 * }
 */
/**
 * @typedef {Object} PostItfDataObject
 * @property {String} id - Unique identifier
 * @property {String} type - ITF type (e.g., "intent_to_file")
 * @property {PostItfAttributeObject} attributes - ITF attributes
 */
/**
 * @typedef {Object} PostItfAttributeObject
 * @property {ITFObject} intentToFile - ITF object
 */
/**
 * @typedef {Object} ITFObject
 * @property {String} id - Unique identifier for the intent to file
 * @property {String} creationDate - ISO 8601 timestamp of when the intent to file was created
 * @property {String} expirationDate - ISO 8601 timestamp of when the intent to file will expire
 * @property {Number} participantId - ID of the participant associated with the intent to file
 * @property {String} source - Source of the intent to file (e.g., "EBN")
 * @property {String} status - Current status of the intent to file (e.g., "active")
 * @property {String} type - Type of benefit associated with the intent to file (e.g., "compensation")
 */

/**
 * Checks if the ITF is active
 * @param {ITFObject} currentITF
 * @returns
 */
export const isActiveItf = currentITF => {
  if (currentITF?.expirationDate) {
    const isActive = currentITF.status === ITF_STATUSES.active;
    return isActive && isNotExpired(currentITF.expirationDate);
  }
  return false;
};

/**
 * Finds the last ITF based on expiration date
 * Note: This can return undefined
 * @param {Array<ITFObject>} itfList - List of ITF objects
 * @returns ITFObject - last (or latest) ITF object
 */
export const findLastItf = itfList =>
  itfList.sort(
    (a, b) => new Date(b.expirationDate) - new Date(a.expirationDate),
  )[0];

/**
 * ITF only supports "compensation" and "pension", but the subtask includes
 * "pensionSurvivorsBenefits" and we're not sure if ITF supports it
 * @param {String} benefitType - benefit type from subtask (e.g. compensation)
 * @returns
 */
export const isSupportedBenefitType = benefitType =>
  ITF_SUPPORTED_BENEFIT_TYPES.some(
    supportedType => benefitType && supportedType.startsWith(benefitType),
  );

export const outsidePaths = [
  '/start',
  '/introduction',
  '/confirmation',
  '/form-saved',
  '/error',
  '/resume',
];

const trailingSlashRegex = /\/$/;

/**
 * Check if the form has been started
 * @param {String} pathname - pathname from Router or window location object
 * @returns {Boolean}
 */
export const isOutsideForm = pathname => {
  const currentPath = (pathname || '').replace(trailingSlashRegex, '');
  return outsidePaths.some(path => currentPath.endsWith(path));
};
