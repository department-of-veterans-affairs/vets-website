import {
  createRateLimitExceededError,
  createInvalidCredentialsError,
  createVassApiError,
  createServiceError,
  createMissingOtpParameterError,
} from '../../services/mocks/utils/errors';
import { createRequestOtpResponse } from '../../services/mocks/utils/responses';

/**
 * Mock request OTP response.
 *
 * Based on API spec: POST /vass/v0/request-otp
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/initiatives/solid-start-scheduling/engineering/api-specification.md#post-vassv0request-otp
 *
 * @export
 * @class MockRequestOtpResponse
 */
export default class MockRequestOtpResponse {
  /**
   * Creates an instance of MockRequestOtpResponse.
   *
   * @param {Object} props - Properties used to create the mock response.
   * @param {string} [props.email='s****@email.com'] - Obfuscated email address.
   * @param {number} [props.expiresIn=600] - Time in seconds until OTP expires (10 minutes).
   * @param {string} [props.message='OTP sent to registered email address'] - Success message.
   * @memberof MockRequestOtpResponse
   */
  constructor({
    email = 's****@email.com',
    expiresIn = 600,
    message = 'OTP sent to registered email address',
  } = {}) {
    this.data = createRequestOtpResponse({ email, expiresIn, message });
  }

  /**
   * Returns the response as a plain object.
   *
   * @returns {Object} The mock response object.
   * @memberof MockRequestOtpResponse
   */
  toJSON() {
    return this.data;
  }

  /**
   * Creates a rate limit exceeded error response.
   *
   * @static
   * @param {number} [retryAfter=900] - Time in seconds before another request can be made.
   * @returns {Object} The error response object.
   * @memberof MockRequestOtpResponse
   */
  static createRateLimitExceededError(retryAfter = 900) {
    return createRateLimitExceededError(retryAfter);
  }

  /**
   * Creates an invalid credentials error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockRequestOtpResponse
   */
  static createInvalidCredentialsError() {
    return createInvalidCredentialsError();
  }

  /**
   * Creates a missing parameter error response.
   *
   * @static
   * @param {string} paramName - The name of the missing parameter (uuid, last_name, or dob).
   * @returns {Object} The error response object.
   * @memberof MockRequestOtpResponse
   */
  static createMissingParameterError(paramName) {
    return createMissingOtpParameterError(paramName);
  }

  /**
   * Creates a VASS API error response (Bad Gateway).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockRequestOtpResponse
   */
  static createVassApiError() {
    return createVassApiError();
  }

  /**
   * Creates a service error response (Service Unavailable).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockRequestOtpResponse
   */
  static createServiceError() {
    return createServiceError();
  }
}
