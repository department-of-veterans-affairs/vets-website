import { createMockJwt } from '../../utils/mock-helpers';

/**
 * OTC (One-Time Code) verification API response fixtures
 * Used by unit tests and local mock server
 */

/**
 * Success response for OTC verification
 */
export const otcSuccess = ({
  token = createMockJwt('mock-uuid'),
  expiresIn = 3600,
  tokenType = 'Bearer',
} = {}) => ({
  data: {
    token,
    expiresIn,
    tokenType,
  },
});

/**
 * Error: Invalid or expired OTC
 */
export const otcInvalidError = ({ attemptsRemaining = 2 } = {}) => ({
  errors: [
    {
      code: 'invalid_otc',
      detail: 'Invalid or expired OTC',
      attemptsRemaining,
      status: 401,
    },
  ],
});

/**
 * Error: Account locked after too many failed attempts
 */
export const otcAccountLockedError = ({ retryAfter = 900 } = {}) => ({
  errors: [
    {
      code: 'account_locked',
      detail: 'Too many failed attempts',
      status: 401,
      retryAfter,
    },
  ],
});
