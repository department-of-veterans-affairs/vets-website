import moment from '../../utils/moment-tz';
import { getTimezoneBySystemId } from '../../utils/timezone';
import { FREE_BUSY_TYPES } from '../../utils/constants';

/**
 *
 * The slot datetimes we get back from VistA include
 * an offset of +00:00 that isn't actually accurate. The times returned are
 * already in the time zone of the facility. In order to prevent
 * moment from using this offset, we'll remove it initially, apply the correct
 * timezone and then convert to UTC which is what FHIR uses
 *
 * @param {string} dateTime A VistA slot datetime
 * @param {string} timezone An IANA timezone, e.g. "America/Denver"
 * @returns {string} A VistA time slot formatted to UTC
 */
function convertToUTC(dateTime, timezone) {
  return moment(dateTime.split('+')?.[0])
    .tz(timezone.timezone, true)
    .utc()
    .format();
}

/**
 * Transforms /vaos/facilities/${facilityId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}&start_date=${startDate}&end_date=${endDate} to
 * /Slot?status=free
 *
 * @export
 * @param {Array} slots A list of appointment slots from var-resources
 * @returns {Array} A list of Slot resources in FHIR format
 */
export function transformSlots(slots, facilityId) {
  const timezone = getTimezoneBySystemId(facilityId);

  return slots.map(slot => ({
    freeBusyType: FREE_BUSY_TYPES.free,
    start: convertToUTC(slot.startDateTime, timezone),
    end: convertToUTC(slot.endDateTime, timezone),
  }));
}
