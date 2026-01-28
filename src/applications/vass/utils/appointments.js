/**
 * @typedef {Object} Topic
 * @property {string} topicId - Unique identifier for the topic
 * @property {string} topicName - Display name of the topic
 */

/**
 * @typedef {Object} Appointment
 * @property {string} appointmentId - Unique identifier for the appointment
 * @property {string} startUTC - Start date/time in ISO 8601 format (UTC)
 * @property {string} endUTC - End date/time in ISO 8601 format (UTC)
 * @property {string} agentId - Unique identifier for the assigned agent
 * @property {string} agentNickname - Display name of the assigned agent
 * @property {number} appointmentStatusCode - Numeric status code (e.g., 1 = Confirmed)
 * @property {string} appointmentStatus - Human-readable status (e.g., 'Confirmed')
 * @property {string} cohortStartUtc - Cohort start date/time in ISO 8601 format (UTC)
 * @property {string} cohortEndUtc - Cohort end date/time in ISO 8601 format (UTC)
 * @property {Topic[]} [topics] - Optional array of topics for the appointment
 */

/**
 * Creates a mock appointment data object for testing purposes.
 * @param {Partial<Appointment>} [appointmentData={}] - Optional partial appointment data to override defaults
 * @returns {Appointment} A complete appointment object with default values merged with overrides
 */
function createAppointmentData(appointmentData = {}) {
  return {
    appointmentId: 'abcdef123456',
    // Currently the appointment GET api does not return topics, so we are not mocking them
    // ideally VASS adds these values to the appointment GET api response
    // topics: [
    //   {
    //     topicId: '123',
    //     topicName: 'General Health',
    //   },
    // ],
    startUTC: '2025-12-24T10:00:00Z',
    endUTC: '2025-12-24T10:30:00Z',
    agentId: '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
    agentNickname: 'Bill Brasky',
    appointmentStatusCode: 1,
    appointmentStatus: 'Confirmed',
    cohortStartUtc: '2025-12-01T00:00:00Z',
    cohortEndUtc: '2026-02-28T23:59:59Z',
    ...appointmentData,
  };
}

/**
 * Creates RTK Query cache state with a pre-populated appointment.
 * Use this to mock the getAppointment query result.
 *
 * @param {string} appointmentId - The appointment ID to use in the cache key
 * @param {Object} appointmentData - The appointment data to cache (use createMockAppointmentData)
 * @returns {Object} RTK Query state object for vassApi
 *
 * @example
 * const vassApiState = createVassApiStateWithAppointment('123', createMockAppointmentData({ appointmentId: '123' }));
 * const options = getDefaultRenderOptions({}, { vassApi: vassApiState });
 */
function createVassApiStateWithAppointment(appointmentId, appointmentData) {
  return {
    queries: {
      [`getAppointment({"appointmentId":"${appointmentId}"})`]: {
        status: 'fulfilled',
        endpointName: 'getAppointment',
        requestId: 'test',
        startedTimeStamp: 0,
        data: { ...appointmentData, appointmentId },
      },
    },
    mutations: {},
    provided: {},
    subscriptions: {},
    config: {
      online: true,
      focused: true,
      middlewareRegistered: true,
    },
  };
}

module.exports = { createAppointmentData, createVassApiStateWithAppointment };
