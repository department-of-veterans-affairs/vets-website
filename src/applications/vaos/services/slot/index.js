/**
 * @module services/Slot
 */
import { parseISO, formatISO } from 'date-fns';

import { getAvailableV2Slots } from '../vaos';
import { mapToFHIRErrors } from '../utils';
import { transformV2Slots } from './transformers';

/**
 * @summary
 * Each FHIR slot will have a start and end
 *
 * @global
 * @typedef {Object} Slot
 * @property {string} start Start date in iso format
 * @property {?string} end End date in iso format
 */

/**
 * Fetch appointment slots based on start/end date times based on a VistA sites
 * availability for a particular type of care
 *
 * @export
 * @async
 * @param {Object} slotsRequest - An object containing the parameters necessary to retrive appointment slots
 * @param {string} slotsRequest.siteId 3 digit facility ID
 * @param {string} slotsRequest.typeOfCareId 3 digit type of care id
 * @param {string} slotsRequest.clinicId clinic id
 * @param {string} slotsRequest.startDate start date to search for appointments lots formatted as YYYY-MM-DD
 * @param {string} slotsRequest.endDate end date to search for appointments lots formatted as YYYY-MM-DD
 * @param {boolean} slotsRequest.convertToUtc check if flag to convert the start and end dates to UTC is set to true
 * @returns {Array<Slot>} A list of Slot resources
 */
export async function getSlots({
  siteId,
  clinicId,
  startDate,
  endDate,
  convertToUtc = false,
}) {
  try {
    // Convert to UTC ISO strings with 'Z'
    const startUtc = convertToUtc
      ? new Date(startDate).toISOString()
      : formatISO(parseISO(startDate));
    const endUtc = convertToUtc
      ? new Date(endDate).toISOString()
      : formatISO(parseISO(endDate));

    const data = await getAvailableV2Slots(
      siteId,
      clinicId.split('_')[1],
      startUtc,
      endUtc,
    );

    return transformV2Slots(data || []);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
