/** @typedef {import('../../../utils/appointments').Appointment} Appointment */
/** @typedef {import('../../../utils/appointments').Topic} Topic */

const { createDefaultTopics } = require('./topic');

/**
 * Mock success responses for VASS API endpoints
 * Based on the API specification:
 * https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/initiatives/solid-start-scheduling/engineering/api-specification.md
 */

/**
 * Creates a success response for POST /vass/v0/request-otp
 * @param {Object} options - Response options
 * @param {string} options.message - Success message
 * @param {number} options.expiresIn - Time in seconds until OTP expires (default 10 minutes)
 * @param {string} options.email - Masked email address
 * @returns {Object} Request OTP success response
 */
const createRequestOtpResponse = ({
  message = 'OTP sent to registered email address',
  expiresIn = 600,
  email = 's****@email.com',
} = {}) => {
  return {
    data: {
      message,
      expiresIn,
      email,
    },
  };
};

/**
 * Creates a success response for POST /vass/v0/authenticate-otp
 * @param {Object} options - Response options
 * @param {string} options.token - JWT token string
 * @param {number} options.expiresIn - Token expiration in seconds (default 1 hour)
 * @returns {Object} Authenticate OTP success response
 */
const createAuthenticateOtpResponse = ({ token, expiresIn = 3600 } = {}) => {
  return {
    data: {
      token,
      expiresIn,
      tokenType: 'Bearer',
    },
  };
};

/**
 * Creates a success response for POST /vass/v0/revoke-token
 * @param {Object} options - Response options
 * @param {string} options.message - Success message
 * @returns {Object} Revoke token success response
 */
const createRevokeTokenResponse = ({
  message = 'Token successfully revoked',
} = {}) => {
  return {
    data: {
      message,
    },
  };
};

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
 * Creates a success response for GET /vass/v0/topics
 * @param {Object} options - Response options
 * @param {Topic[]} options.topics - Array of topic objects with topicId and topicName
 * @returns {Object} Topics success response
 */
const createTopicsResponse = ({ topics = [] } = {}) => {
  return {
    data: {
      topics,
    },
  };
};

/**
 * Creates a success response with default topics
 * @param {Object} options - Response options
 * @param {number} options.numberOfTopics - Number of topics to include in the response (default 17)
 * @returns {Object} Topics success response with default topics
 */
const createTopicsResponseWithDefaultTopics = (numberOfTopics = 17) => {
  const topics = createDefaultTopics(numberOfTopics);
  return createTopicsResponse({ topics });
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
  createRequestOtpResponse,
  createAuthenticateOtpResponse,
  createRevokeTokenResponse,
  createAppointmentAvailabilityResponse,
  createTopicsResponse,
  createTopicsResponseWithDefaultTopics,
  createAppointmentResponse,
  createAppointmentDetailsResponse,
  createCancelAppointmentResponse,
};
