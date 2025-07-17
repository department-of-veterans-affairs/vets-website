/**
 * @module services/Slot/transformers
 */

import { isValid, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { DATE_FORMATS } from '../../utils/constants';

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
      .filter(slot => !!slot.start && isValid(new Date(slot.start)))
      .map(slot => ({
        id: slot.id,
        start: formatInTimeZone(
          parseISO(slot.start),
          'UTC',
          DATE_FORMATS.ISODateTimeUTC,
        ),
        end: formatInTimeZone(
          parseISO(slot.end),
          'UTC',
          DATE_FORMATS.ISODateTimeUTC,
        ),
      }))
  );
}
