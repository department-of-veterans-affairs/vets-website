/**
 * @module services/Slot
 */
import { getAvailableSlots } from '../var';
import { getAvailableV2Slots } from '../vaos';
import { mapToFHIRErrors } from '../utils';
import { transformSlots } from './transformers';
import { transformV2Slots } from './transformers.v2';
import moment from 'moment';

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
export async function getSlots({
  siteId,
  typeOfCareId,
  clinicId,
  startDate,
  endDate,
  useV2 = false,
}) {
  try {
    let data;
    if (useV2) {
      data = await getAvailableV2Slots(
        siteId,
        clinicId.split('_')[1],
        moment(startDate).format(),
        moment(endDate).format(),
      );
      return transformV2Slots(data || []);
    } else {
      data = await getAvailableSlots(
        siteId,
        typeOfCareId,
        clinicId.split('_')[1],
        startDate,
        endDate,
      );
      return transformSlots(data[0]?.appointmentTimeSlot || []);
    }
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
