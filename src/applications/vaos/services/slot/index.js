/**
 * @module services/Slot
 */
import moment from 'moment';
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
 * @param {Boolean} useV2 Toggle fetching appointments via VAOS api services version 2
 * @returns {Array<Slot>} A list of Slot resources
 */
export async function getSlots({ siteId, clinicId, startDate, endDate }) {
  try {
    const data = await getAvailableV2Slots(
      siteId,
      clinicId.split('_')[1],
      moment(startDate).format(),
      moment(endDate).format(),
    );
    return transformV2Slots(data || []);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
