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
      .filter(slot => !!slot.start && moment(slot.start).isValid())
      .map(slot => ({
        id: slot.id,
        start: slot.start,
        end: slot.end,
      }))
  );
}
