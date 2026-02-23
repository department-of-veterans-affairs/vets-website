import {
  createCancellationFailedError,
  createAppointmentNotFoundError,
  createMissingAppointmentParameterError,
  createUnauthorizedError,
  createVassApiError,
  createServiceError,
} from '../../services/mocks/utils/errors';
import { createCancelAppointmentResponse } from '../../services/mocks/utils/responses';

/**
 * Mock response class for POST /vass/v0/appointment/{appointmentId}/cancel
 *
 * Based on the VASS API specification:
 * https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/initiatives/solid-start-scheduling/engineering/api-specification.md#post-vassv0appointmentappointmentidcancel
 */
export default class MockCancelAppointmentResponse {
  /**
   * Creates a successful cancel appointment response.
   *
   * @param {Object} options - Configuration options.
   * @param {string} [options.appointmentId='abcdef123456'] - The unique identifier of the cancelled appointment.
   */
  constructor({ appointmentId = 'abcdef123456' } = {}) {
    this.data = createCancelAppointmentResponse({ appointmentId });
  }

  /**
   * Returns the response as a JSON object.
   *
   * @returns {Object} The response object with data property.
   */
  toJSON() {
    return this.data;
  }

  /**
   * Creates a cancellation failed error response.
   *
   * @returns {Object} Error response for when cancellation fails.
   */
  static createCancellationFailedError() {
    return createCancellationFailedError();
  }

  /**
   * Creates an appointment not found error response.
   *
   * @returns {Object} Error response for when appointment is not found.
   */
  static createAppointmentNotFoundError() {
    return createAppointmentNotFoundError();
  }

  /**
   * Creates a missing appointment ID error response.
   *
   * @returns {Object} Error response for missing appointment_id parameter.
   */
  static createMissingAppointmentIdError() {
    return createMissingAppointmentParameterError('appointment_id');
  }

  /**
   * Creates an unauthorized error response.
   *
   * @returns {Object} Error response for unauthorized access.
   */
  static createUnauthorizedError() {
    return createUnauthorizedError();
  }

  /**
   * Creates a VASS API error response.
   *
   * @returns {Object} Error response for upstream API issues.
   */
  static createVassApiError() {
    return createVassApiError();
  }

  /**
   * Creates a generic service error response.
   *
   * @returns {Object} Error response for service unavailability.
   */
  static createServiceError() {
    return createServiceError();
  }
}
