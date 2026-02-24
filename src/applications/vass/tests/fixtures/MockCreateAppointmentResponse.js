import {
  createAppointmentSaveFailedError,
  createMissingAppointmentParameterError,
  createUnauthorizedError,
  createVassApiError,
  createServiceError,
} from '../../services/mocks/utils/errors';
import { createAppointmentResponse } from '../../services/mocks/utils/responses';

/**
 * Mock create appointment response.
 *
 * Based on API spec: POST /vass/v0/appointment
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/initiatives/solid-start-scheduling/engineering/api-specification.md#post-vassv0appointment
 *
 * @export
 * @class MockCreateAppointmentResponse
 */
export default class MockCreateAppointmentResponse {
  /**
   * Creates an instance of MockCreateAppointmentResponse.
   *
   * @param {Object} props - Properties used to create the mock response.
   * @param {string} [props.appointmentId='abcdef123456'] - Unique identifier for the newly created appointment.
   * @memberof MockCreateAppointmentResponse
   */
  constructor({ appointmentId = 'abcdef123456' } = {}) {
    this.data = createAppointmentResponse({ appointmentId });
  }

  /**
   * Returns the response as a plain object.
   *
   * @returns {Object} The mock response object.
   * @memberof MockCreateAppointmentResponse
   */
  toJSON() {
    return this.data;
  }

  /**
   * Creates a missing parameter error response.
   *
   * @static
   * @param {string} paramName - The name of the missing parameter (topics, dtStartUtc, or dtEndUtc).
   * @returns {Object} The error response object.
   * @memberof MockCreateAppointmentResponse
   */
  static createMissingParameterError(paramName) {
    return createMissingAppointmentParameterError(paramName);
  }

  /**
   * Creates a missing topics error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockCreateAppointmentResponse
   */
  static createMissingTopicsError() {
    return createMissingAppointmentParameterError('topics');
  }

  /**
   * Creates a missing start time error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockCreateAppointmentResponse
   */
  static createMissingStartTimeError() {
    return createMissingAppointmentParameterError('dtStartUtc');
  }

  /**
   * Creates a missing end time error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockCreateAppointmentResponse
   */
  static createMissingEndTimeError() {
    return createMissingAppointmentParameterError('dtEndUtc');
  }

  /**
   * Creates an appointment save failed error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockCreateAppointmentResponse
   */
  static createAppointmentSaveFailedError() {
    return createAppointmentSaveFailedError();
  }

  /**
   * Creates an unauthorized error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockCreateAppointmentResponse
   */
  static createUnauthorizedError() {
    return createUnauthorizedError();
  }

  /**
   * Creates a VASS API error response (Bad Gateway).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockCreateAppointmentResponse
   */
  static createVassApiError() {
    return createVassApiError();
  }

  /**
   * Creates a service error response (Service Unavailable).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockCreateAppointmentResponse
   */
  static createServiceError() {
    return createServiceError();
  }
}
