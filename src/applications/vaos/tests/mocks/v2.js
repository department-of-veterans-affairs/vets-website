/**
 *
 * Skeleton mocks for VAOS service data responses
 *
 * Avoid depending on the data in specific fields in here in your tests, prefer to
 * set field data in your test function
 *
 * @module testing/mocks/data
 */

/**
 * Return a stubbed VAOS VA request item
 *
 * @export
 * @returns {VAOSRequest} VAOS VA request object
 */

export function getVAOSRequestMock() {
  return {
    resourceType: 'Appointment',
    id: '25957',
    status: 'proposed',
    cancelationReason: null,
    requestedPeriod: null,
    start: null,
    created: null,
    minutesDuration: null,
    type: { coding: [{ code: '323', display: 'Primary care' }] },
    reason: 'Follow-up/Routine',
    location: { vistaId: '983', clinicId: null, stationId: '983GC' },
    contact: {
      telecom: [
        { system: 'phone', value: '2125551212' },
        { system: 'email', value: 'veteranemailtest@va.gov' },
      ],
    },
    preferredTimesForPhoneCall: ['Afternoon', 'Evening'],
    comment: 'fake',
    videoData: { isVideo: false },
    practitioners: [],
    vaos: {
      isVideo: false,
      appointmentType: 'vaAppointment',
      isCommunityCare: false,
      isExpressCare: false,
      apiData: {},
    },
  };
}
