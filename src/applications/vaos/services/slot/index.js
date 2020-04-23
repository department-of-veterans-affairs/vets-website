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
 * @param {string} facilityId 3 digit facility ID
 * @param {string} typeOfCareId 3 digit type of care id
 * @param {string} clinicId 3 digit clinic id
 * @param {string} startDate start date to search for appointments lots formatted as YYYY-MM-DD
 * @param {string} endDate end date to search for appointments lots formatted as YYYY-MM-DD
 */
export async function getSlots(
  facilityId,
  typeOfCareId,
  clinicId,
  startDate,
  endDate,
) {
  try {
    const slots = await getAvailableSlots(
      facilityId,
      typeOfCareId,
      clinicId,
      startDate,
      endDate,
    );

    return transformSlots(slots);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
