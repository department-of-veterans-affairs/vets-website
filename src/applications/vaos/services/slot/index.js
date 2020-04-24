/*
 * Functions in here should map a var-resources API request to a similar response from
 * a FHIR resource request
 */
import { getAvailableSlots } from '../../api';
import { mapToFHIRErrors } from '../../utils/fhir';
import { transformSlots } from './transformers';

/**
 * Fetch appointment slots based on start/end date times based on a VistA sites
 * availability for a particular type of care
 *
 * @param {Object} slotsRequest - An object containing the parameters necessary to retrive appointment slots
 * @param {string} slotsRequest.vistaFacilityId 3 digit facility ID
 * @param {string} slotsRequest.vistaTypeOfCareId 3 digit type of care id
 * @param {string} slotsRequest.vistaClinicId 3 digit clinic id
 * @param {string} startDate start date to search for appointments lots formatted as YYYY-MM-DD
 * @param {string} endDate end date to search for appointments lots formatted as YYYY-MM-DD
 */
export async function getSlots({
  vistaFacilityId,
  vistaTypeOfCareId,
  vistaClinicId,
  startDate,
  endDate,
}) {
  try {
    const data = await getAvailableSlots(
      vistaFacilityId,
      vistaTypeOfCareId,
      vistaClinicId,
      startDate,
      endDate,
    );

    return transformSlots(data[0]?.appointmentTimeSlot || [], vistaFacilityId);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
