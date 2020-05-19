import moment from 'moment';
import { FREE_BUSY_TYPES } from '../../utils/constants';

/**
 * Transforms /vaos/facilities/${facilityId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}&start_date=${startDate}&end_date=${endDate} to
 * /Slot?status=free
 *
 * @export
 * @param {Array} slots A list of appointment slots from var-resources
 * @returns {Array} A list of Slot resources in FHIR format
 */
export function transformSlots(slots) {
  return (
    slots
      // moved over from action creator
      .filter(
        slot => !!slot.startDateTime && moment(slot.startDateTime).isValid(),
      )
      .map(slot => ({
        freeBusyType: FREE_BUSY_TYPES.free,
        /**
         *
         * The slot datetimes we get back from VistA include
         * an offset of +00:00 that isn't actually accurate. The times returned are
         * already in the time zone of the facility. In order to prevent
         * moment from using this offset, we'll remove it until we know what offset VSP will be using
         */
        start: slot.startDateTime.replace('+0:00', ''),
        end: slot.endDateTime.replace('+0:00', ''),
      }))
  );
}
