/**
 * @module services/Slot/transformers
 */

import moment from 'moment';

/**
 * Transforms /vaos/v2/locations/${facilityId}/clinics/${clinicId}/slots?start=${startDate}&end=${endDate} to
 * /Slot
 *
 * @export
 * @param {Array<VARSlot>} slots A list of appointment slots from var-resources
 * @returns {Array<Slot>} A list of Slot resources in FHIR format
 */
export function transformV2Slots(slots) {
  return (
    slots
      // moved over from action creator
      .filter(
        slot => !!slot.startDateTime && moment(slot.startDateTime).isValid(),
      )
      .map(slot => ({
        id: slot.id,
        type: slot.type,
        /**
         *
         * The slot datetimes we get back from VistA include
         * an offset of +00:00 that isn't actually accurate. The times returned are
         * already in the time zone of the facility. In order to prevent
         * moment from using this offset, we'll remove it until we know what offset VSP will be using
         */
        attributes: {
          start: slot.startDateTime.replace('+00:00', ''),
          end: slot.endDateTime.replace('+00:00', ''),
        },
      }))
  );
}
