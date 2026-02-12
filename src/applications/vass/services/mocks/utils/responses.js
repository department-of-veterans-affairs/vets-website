/** @typedef {import('../../../utils/appointments').Appointment} Appointment */

/**
 * Mock success responses for VASS API endpoints
 * Based on the API specification:
 * https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/initiatives/solid-start-scheduling/engineering/api-specification.md
 */

/**
 * Creates a success response for GET /vass/v0/appointment-availability
 * @param {Object} options - Response options
 * @param {string} options.appointmentId - Unique identifier for the appointment
 * @param {Array} options.availableSlots - Array of available time slots
 * @returns {Object} Appointment availability success response
 */
const createAppointmentAvailabilityResponse = ({
  appointmentId = 'e61e1a40-1e63-f011-bec2-001dd80351ea',
  availableSlots = [],
} = {}) => {
  return {
    data: {
      appointmentId,
      availableSlots,
    },
  };
};

/**
 * Creates a success response for POST /vass/v0/appointment
 * @param {Object} options - Response options
 * @param {string} options.appointmentId - Unique identifier for the newly created appointment
 * @returns {Object} Create appointment success response
 */
const createAppointmentResponse = ({ appointmentId = 'abcdef123456' } = {}) => {
  return {
    data: {
      appointmentId,
    },
  };
};

/**
 * Creates a success response for GET /vass/v0/appointment/{appointmentId}
 * @param {Partial<Appointment>} options - Response options
 * @returns {Appointment} Appointment details success response
 */
const createAppointmentDetailsResponse = ({
  appointmentId = 'e61e1a40-1e63-f011-bec2-001dd80351ea',
  startUTC = '2025-12-24T10:00:00Z',
  endUTC = '2025-12-24T10:30:00Z',
  agentId = '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
  agentNickname = 'Agent Smith',
  appointmentStatusCode = 1,
  appointmentStatus = 'Confirmed',
  cohortStartUtc = '2025-12-01T00:00:00Z',
  cohortEndUtc = '2026-02-28T23:59:59Z',
} = {}) => {
  return {
    data: {
      appointmentId,
      startUTC,
      endUTC,
      agentId,
      agentNickname,
      appointmentStatusCode,
      appointmentStatus,
      cohortStartUtc,
      cohortEndUtc,
    },
  };
};

/**
 * Creates a success response for POST /vass/v0/appointment/{appointmentId}/cancel
 * @param {Object} options - Response options
 * @param {string} options.appointmentId - Unique identifier of the cancelled appointment
 * @returns {Object} Cancel appointment success response
 */
const createCancelAppointmentResponse = ({
  appointmentId = 'abcdef123456',
} = {}) => {
  return {
    data: {
      appointmentId,
    },
  };
};

module.exports = {
  createAppointmentAvailabilityResponse,
  createAppointmentResponse,
  createAppointmentDetailsResponse,
  createCancelAppointmentResponse,
};
