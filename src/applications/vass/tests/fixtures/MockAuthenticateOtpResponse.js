import {
  createOTPInvalidError,
  createOTPAccountLockedError,
  createVassApiError,
  createServiceError,
  createMissingAuthParameterError,
  createOTPExpiredError,
} from '../../services/mocks/utils/errors';
import { createAuthenticateOtpResponse } from '../../services/mocks/utils/responses';

/**
 * Mock authenticate OTP response.
 *
 * Based on API spec: POST /vass/v0/authenticate-otp
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/initiatives/solid-start-scheduling/engineering/api-specification.md#post-vassv0authenticate-otp
 *
 * @export
 * @class MockAuthenticateOtpResponse
 */
export default class MockAuthenticateOtpResponse {
  /**
   * Creates an instance of MockAuthenticateOtpResponse.
   *
   * @param {Object} props - Properties used to create the mock response.
   * @param {string} [props.token='mock-jwt-token'] - JWT token string.
   * @param {number} [props.expiresIn=3600] - Token expiration in seconds (1 hour).
   * @param {string} [props.tokenType='Bearer'] - Token type for Authorization header.
   * @memberof MockAuthenticateOtpResponse
   */
  constructor({ token = 'mock-jwt-token', expiresIn = 3600 } = {}) {
    this.data = createAuthenticateOtpResponse({ token, expiresIn });
  }

  /**
   * Returns the response as a plain object.
   *
   * @returns {Object} The mock response object.
   * @memberof MockAuthenticateOtpResponse
   */
  toJSON() {
    return this.data;
  }

  /**
   * Creates an invalid OTP error response.
   *
   * @static
   * @param {number} [attemptsRemaining=3] - Number of validation attempts left before lockout.
   * @returns {Object} The error response object.
   * @memberof MockAuthenticateOtpResponse
   */
  static createInvalidOtpError(attemptsRemaining = 3) {
    return createOTPInvalidError(attemptsRemaining);
  }

  /**
   * Creates an account locked error response.
   *
   * @static
   * @param {number} [retryAfter=900] - Time in seconds before a new OTP can be requested (15 minutes).
   * @returns {Object} The error response object.
   * @memberof MockAuthenticateOtpResponse
   */
  static createAccountLockedError(retryAfter = 900) {
    return createOTPAccountLockedError(retryAfter);
  }

  /**
   * Creates an OTP expired error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAuthenticateOtpResponse
   */
  static createOtpExpiredError() {
    return createOTPExpiredError();
  }

  /**
   * Creates a missing parameter error response.
   *
   * @static
   * @param {string} paramName - The name of the missing parameter (uuid, last_name, dob, or otp).
   * @returns {Object} The error response object.
   * @memberof MockAuthenticateOtpResponse
   */
  static createMissingParameterError(paramName) {
    return createMissingAuthParameterError(paramName);
  }

  /**
   * Creates a VASS API error response (Bad Gateway).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAuthenticateOtpResponse
   */
  static createVassApiError() {
    return createVassApiError();
  }

  /**
   * Creates a service error response (Service Unavailable).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAuthenticateOtpResponse
   */
  static createServiceError() {
    return createServiceError();
  }
}
