import {
  createAppointmentNotFoundError,
  createMissingAppointmentParameterError,
  createUnauthorizedError,
  createVassApiError,
  createServiceError,
} from '../../services/mocks/utils/errors';
import { createAppointmentDetailsResponse } from '../../services/mocks/utils/responses';

/** @typedef {import('../../utils/appointments').Appointment} Appointment */

/**
 * Mock appointment details response.
 *
 * Based on API spec: GET /vass/v0/appointment/{appointmentId}
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/initiatives/solid-start-scheduling/engineering/api-specification.md#get-vassv0appointmentappointmentid
 *
 * @export
 * @class MockAppointmentDetailsResponse
 */
export default class MockAppointmentDetailsResponse {
  /**
   * Creates an instance of MockAppointmentDetailsResponse.
   *
   * @param {Partial<Appointment>} [props={}] - Properties used to create the mock response.
   * @memberof MockAppointmentDetailsResponse
   */
  constructor({
    appointmentId = 'abcdef123456',
    startUTC = '2025-12-24T10:00:00Z',
    endUTC = '2025-12-24T10:30:00Z',
    agentId = '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
    agentNickname = 'Agent Smith',
    appointmentStatusCode = 1,
    appointmentStatus = 'Confirmed',
    cohortStartUtc = '2025-12-01T00:00:00Z',
    cohortEndUtc = '2026-02-28T23:59:59Z',
  } = {}) {
    this.data = createAppointmentDetailsResponse({
      appointmentId,
      startUTC,
      endUTC,
      agentId,
      agentNickname,
      appointmentStatusCode,
      appointmentStatus,
      cohortStartUtc,
      cohortEndUtc,
    });
  }

  /**
   * Returns the response as a plain object.
   *
   * @returns {Appointment} The mock response object (appointment details).
   * @memberof MockAppointmentDetailsResponse
   */
  toJSON() {
    return this.data;
  }

  /**
   * Creates an appointment not found error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentDetailsResponse
   */
  static createAppointmentNotFoundError() {
    return createAppointmentNotFoundError();
  }

  /**
   * Creates a missing appointment ID parameter error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentDetailsResponse
   */
  static createMissingAppointmentIdError() {
    return createMissingAppointmentParameterError('appointment_id');
  }

  /**
   * Creates an unauthorized error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentDetailsResponse
   */
  static createUnauthorizedError() {
    return createUnauthorizedError();
  }

  /**
   * Creates a VASS API error response (Bad Gateway).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentDetailsResponse
   */
  static createVassApiError() {
    return createVassApiError();
  }

  /**
   * Creates a service error response (Service Unavailable).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentDetailsResponse
   */
  static createServiceError() {
    return createServiceError();
  }
}
