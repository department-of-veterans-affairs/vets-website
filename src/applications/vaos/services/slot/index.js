/**
 * @module services/Slot
 */
import { getAvailableSlots } from '../var';
import { fhirSearch, mapToFHIRErrors } from '../utils';
import { transformSlots } from './transformers';

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
 * @returns {Array} A FHIR searchset of Slot resources
 */
export async function getSlots({
  siteId,
  typeOfCareId,
  clinicId,
  startDate,
  endDate,
  useVSP,
}) {
  if (useVSP) {
    return fhirSearch({
      query: `Slot?schedule.actor=HealthcareService/${clinicId}&start=lt${endDate}&start=ge${startDate}`,
    });
  } else {
    try {
      const data = await getAvailableSlots(
        siteId,
        typeOfCareId,
        clinicId.split('_')[1],
        startDate,
        endDate,
      );

      return transformSlots(data[0]?.appointmentTimeSlot || []);
    } catch (e) {
      if (e.errors) {
        throw mapToFHIRErrors(e.errors);
      }

      throw e;
    }
  }
}
