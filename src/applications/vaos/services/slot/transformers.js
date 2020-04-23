/**
 * Transforms /vaos/facilities/${facilityId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}&start_date=${startDate}&end_date=${endDate} to
 * /Slot?status=free
 *
 * @export
 * @param {Array} slots A list of appointment slots from var-resources
 * @returns {Array} A list of Slot resources in FHIR format
 */
export function transformSlots(slots) {
  return slots.map(slot => ({
    status: 'free',
    start: slot.startDateTime,
    end: slot.endDateTime,
  }));
}
