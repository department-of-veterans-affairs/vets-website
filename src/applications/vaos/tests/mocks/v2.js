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
    id: null,
    type: 'appointments',
    attributes: {
      cancellationReason: null,
      clinic: null,
      comment: null,
      contact: {},
      description: null,
      end: null,
      id: null,
      kind: null,
      locationId: null,
      minutesDuration: null,
      practitioners: [],
      preferredTimesForPhoneCall: [],
      priority: null,
      reason: null,
      requestedPeriods: [],
      serviceType: null,
      slot: null,
      start: null,
      status: null,
      telehealth: null,
    },
  };
}
