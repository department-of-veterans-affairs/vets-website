/**
 * @module services/Slot
 */
import { parseISO, format } from 'date-fns';

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
 * This will fetch slots for both OH and VistA clinics/facilities. Depending on
 * which EHR is being queried, there will be different required and optional
 * params:
 *
 * VistA required params: siteId (facilityId), clinicId, startDate, endDate
 *
 * OH required params: siteId (facilityId), startDate, endDate
 * More often than not, a OH will also include the typeofCare and provider
 * params as well
 *
 * @export
 * @async
 * @param {Object} slotsRequest - An object containing the parameters necessary to retrieve appointment slots
 * @param {string} slotsRequest.siteId 3 digit facility ID
 * @param {string} [slotsRequest.clinicId=null] optional clinic id
 * @param {string} [slotsRequest.typeOfCare=null] optional typeOfCare string
 * @param {string} [slotsRequest.provider=null] optional OH provider id
 * @param {string} slotsRequest.startDate start date to search for appointments slots
 * @param {string} slotsRequest.endDate end date to search for appointments slots
 * @param {boolean} slotsRequest.convertToUtc check if flag to convert the start and end dates to UTC is set to true
 * @returns {Array<Slot>} A list of Slot resources
 */
export async function getSlots({
  siteId,
  clinicId = null,
  typeOfCare = null,
  provider = null,
  startDate,
  endDate,
  convertToUtc = false,
}) {
  try {
    const parseStartDate = parseISO(startDate);
    const parseEndDate = parseISO(endDate);

    const start = convertToUtc
      ? parseStartDate.toISOString()
      : format(parseStartDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
    const end = convertToUtc
      ? parseEndDate.toISOString()
      : format(parseEndDate, "yyyy-MM-dd'T'HH:mm:ssxxx");

    const data = await getAvailableV2Slots(
      siteId,
      clinicId.split('_')[1],
      typeOfCare,
      provider,
      start,
      end,
    );

    return transformV2Slots(data || []);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
