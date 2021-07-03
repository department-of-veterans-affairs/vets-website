/* eslint-disable camelcase */
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
      contact: {
        telecom: [],
      },
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

/**
 * Returns a stubbed var-resources parent site object from the VAOS service.
 *
 * @export
 * @param {String} id id for the appointment
 * @returns {VARParentSite} var-resources parent site object
 */
export function getVAOSParentSiteMock(id) {
  return {
    id,
    type: 'facility',
    attributes: {
      id: 'fake',
      vista_site: id.substring(0, 3),
      vast_parent: id,
      name: 'fake',
      physical_address: {
        line: [],
        city: 'fake',
        state: 'fake',
        postal_code: 'fake',
      },
    },
  };
}
