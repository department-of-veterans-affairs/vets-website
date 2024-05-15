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
      cancelationReason: null,
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
      reasonCode: {},
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
      cancelationReason: null,
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
      patientInstruction: null,
      practitioners: [],
      preferredTimesForPhoneCall: [],
      priority: null,
      reasonCode: {},
      requestedPeriods: null,
      serviceType: null,
      slot: null,
      start: null,
      status: 'booked',
      telehealth: null,
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
 * Returns a stubbed vaos VistA clinic object.
 *
 * @export
 * @returns {VAOSClinic} var-resources clinic object
 */
export function getV2ClinicMock({ id, stationId, serviceName }) {
  return {
    id,
    type: 'clinics',
    attributes: {
      vistaSite: stationId.substr(0, 3),
      id,
      serviceName,
      physicalLocation: null,
      phoneNumber: null,
      stationId,
      stationName: null,
      primaryStopCode: null,
      primaryStopCodeName: null,
      secondaryStopCode: null,
      secondaryStopCodeName: null,
      patientDirectScheduling: null,
      patientDisplay: null,
      char4: null,
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
    type: 'slots',
    attributes: {
      start: 'fake startDateTime',
      end: 'fake endDateTime',
    },
  };
}
