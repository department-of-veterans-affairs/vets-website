const {
  OTP_ERROR_CODES,
  AUTH_ERROR_CODES,
  TOKEN_ERROR_CODES,
  APPOINTMENT_ERROR_CODES,
  SERVER_ERROR_CODES,
  AVAILABILITY_ERROR_CODES,
} = require('../../../utils/constants');

const createVassApiError = () => {
  return {
    errors: [
      {
        code: SERVER_ERROR_CODES.VASS_API_ERROR,
        detail: 'Unable to connect to scheduling service',
      },
    ],
  };
};

const createUnauthorizedError = () => {
  return {
    errors: [{ code: TOKEN_ERROR_CODES.UNAUTHORIZED, detail: 'Unauthorized' }],
  };
};

const createInvalidTokenError = () => {
  return {
    errors: [
      {
        code: TOKEN_ERROR_CODES.INVALID_TOKEN,
        detail: 'Token is invalid or already revoked',
      },
    ],
  };
};

const createOTPInvalidError = (attemptsRemaining = 0) => {
  return {
    errors: [
      {
        code: OTP_ERROR_CODES.INVALID_OTP,
        detail: 'Invalid or expired OTP.  Please try again.',
        attemptsRemaining,
      },
    ],
  };
};

const createOTPAccountLockedError = (retryAfter = 900) => {
  return {
    errors: [
      {
        code: OTP_ERROR_CODES.ACCOUNT_LOCKED,
        detail: 'Too many failed attempts.  Please request a new OTP.',
        retryAfter,
      },
    ],
  };
};

const createRateLimitExceededError = (retryAfter = 900) => {
  return {
    errors: [
      {
        code: AUTH_ERROR_CODES.RATE_LIMIT_EXCEEDED,
        detail: 'Too many OTP requests.  Please try again later.',
        retryAfter,
      },
    ],
  };
};

const createAppointmentSaveFailedError = () => {
  return {
    errors: [
      {
        code: APPOINTMENT_ERROR_CODES.APPOINTMENT_SAVE_FAILED,
        detail: 'Failed to save appointment',
      },
    ],
  };
};

const createServiceError = () => {
  return {
    errors: [
      {
        code: SERVER_ERROR_CODES.SERVICE_ERROR,
        detail: 'Service temporarily unavailable',
      },
    ],
  };
};

const createInvalidCredentialsError = () => {
  return {
    errors: [
      {
        code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        detail: 'Unable to verify identity. Please check your information.',
      },
    ],
  };
};

const createNotWithinCohortError = () => {
  return {
    errors: [
      {
        code: AVAILABILITY_ERROR_CODES.NOT_WITHIN_COHORT,
        detail: 'Current date outside of appointment cohort date ranges',
      },
    ],
  };
};

const createAppointmentAlreadyBookedError = ({
  appointmentId = 'e61e1a40-1e63-f011-bec2-001dd80351ea',
  dtStartUTC = '2025-12-20T14:00:00Z',
  dtEndUTC = '2025-12-20T14:30:00Z',
} = {}) => {
  return {
    errors: [
      {
        code: AVAILABILITY_ERROR_CODES.APPOINTMENT_ALREADY_BOOKED,
        detail: 'already scheduled',
        appointment: {
          appointmentId,
          dtStartUTC,
          dtEndUTC,
        },
      },
    ],
  };
};

const createNoSlotsAvailableError = () => {
  return {
    errors: [
      {
        code: AVAILABILITY_ERROR_CODES.NO_SLOTS_AVAILABLE,
        detail: 'No available appointment slots',
      },
    ],
  };
};

const createMissingAuthParameterError = paramName => {
  return {
    errors: [
      {
        code: AUTH_ERROR_CODES.MISSING_PARAMETER,
        detail: `param is missing or the value is empty: ${paramName}`,
      },
    ],
  };
};

const createMissingOtpParameterError = paramName => {
  return {
    errors: [
      {
        code: OTP_ERROR_CODES.MISSING_PARAMETER,
        detail: `param is missing or the value is empty: ${paramName}`,
      },
    ],
  };
};

const createMissingAppointmentParameterError = paramName => {
  return {
    errors: [
      {
        code: APPOINTMENT_ERROR_CODES.MISSING_PARAMETER,
        detail: `param is missing or the value is empty: ${paramName}`,
      },
    ],
  };
};

const createOTPExpiredError = () => {
  return {
    errors: [
      {
        code: OTP_ERROR_CODES.OTP_EXPIRED,
        detail: 'OTP has expired. Please request a new one.',
      },
    ],
  };
};

const createAppointmentNotFoundError = () => {
  return {
    errors: [
      {
        code: APPOINTMENT_ERROR_CODES.APPOINTMENT_NOT_FOUND,
        detail: 'Appointment not found',
      },
    ],
  };
};

const createCancellationFailedError = () => {
  return {
    errors: [
      {
        code: APPOINTMENT_ERROR_CODES.CANCELLATION_FAILED,
        detail: 'Failed to cancel appointment',
      },
    ],
  };
};

module.exports = {
  createVassApiError,
  createOTPInvalidError,
  createOTPAccountLockedError,
  createRateLimitExceededError,
  createUnauthorizedError,
  createAppointmentSaveFailedError,
  createServiceError,
  createInvalidCredentialsError,
  createNotWithinCohortError,
  createAppointmentAlreadyBookedError,
  createInvalidTokenError,
  createNoSlotsAvailableError,
  createMissingAuthParameterError,
  createMissingOtpParameterError,
  createMissingAppointmentParameterError,
  createOTPExpiredError,
  createAppointmentNotFoundError,
  createCancellationFailedError,
};
