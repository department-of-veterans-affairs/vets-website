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
      status: 'proposed',
      telehealth: null,
    },
  };
}

/**
 * Return a stubbed VAOS VA appointment item
 *
 * @export
 * @returns {VAOSRequest} VAOS VA request object
 */
export function getVAOSAppointmentMock() {
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
      requestedPeriods: null,
      serviceType: null,
      slot: null,
      start: null,
      status: 'booked',
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
export function getV2FacilityMock({
  id = 'Fake',
  name = 'Fake',
  isParent = false,
}) {
  return {
    id,
    type: 'facility',
    attributes: {
      id: 'fake',
      vistaSite: id.substring(0, 3),
      vastParent: isParent ? id : id.substring(0, 3),
      name,
      physicalAddress: {
        line: [],
        city: 'fake',
        state: 'fake',
        postalCode: 'fake',
      },
    },
  };
}

export function getSchedulingConfigurationMock({
  id = 'fake',
  typeOfCareId = 'fake',
  requestEnabled = false,
  directEnabled = false,
  patientHistoryRequired = 'No',
  patientHistoryDuration = 365,
  communityCare = false,
} = {}) {
  return {
    id,
    type: 'scheduling_configuration',
    attributes: {
      facilityId: id,
      services: [
        {
          id: typeOfCareId,
          name: 'Some type of care',
          stopCodes: [],
          direct: {
            patientHistoryRequired,
            patientHistoryDuration,
            enabled: directEnabled,
          },
          request: {
            patientHistoryRequired,
            patientHistoryDuration,
            enabled: requestEnabled,
          },
        },
      ],
      communityCare,
    },
  };
}

/**
 * Returns a stubbed VAOS service VistA clinic appointment slot object.
 *
 * @export
 * @returns {VAOSlot} VAOS service clinic appointment slot object
 */
export function getAppointmentSlotMock() {
  return {
    id: 'fake',
    start: 'fake startDateTime',
    end: 'fake endDateTime',
  };
}
