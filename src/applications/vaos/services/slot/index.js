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
 * If siteId is a facility that uses VistA for scheduling then the clinicId parameter is required and the typeOfCare
 * parameter is ignored if present.
 *
 * If siteId is a facility that uses Oracle Health (Cerner) for scheduling then the typeOfCare parameter is required and
 * the clinicId is ignored if present.
 *
 * @export
 * @async
 * @param {Object} slotsRequest - An object containing the parameters necessary to retrieve appointment slots
 * @param {string} slotsRequest.siteId 3 digit facility ID
 * @param {string} slotsRequest.clinicId clinic id
 * @param {string} [slotsRequest.typeOfCare=null] The type of care (e.g. 'primaryCare')
 * @param {string} slotsRequest.startDate start date to search for appointments lots formatted as YYYY-MM-DD
 * @param {string} slotsRequest.endDate end date to search for appointments lots formatted as YYYY-MM-DD
 * @returns {Array<Slot>} A list of Slot resources
 */
export async function getSlots({
  siteId,
  clinicId,
  typeOfCare = null,
  startDate,
  endDate,
}) {
  try {
    const data = await getAvailableV2Slots(
      siteId,
      clinicId.split('_')[1],
      typeOfCare,
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
