import {
  createNotWithinCohortError,
  createAppointmentAlreadyBookedError,
  createNoSlotsAvailableError,
  createUnauthorizedError,
  createVassApiError,
  createServiceError,
} from '../../services/mocks/utils/errors';
import { createAppointmentAvailabilityResponse } from '../../services/mocks/utils/responses';

/** @typedef {import('../../redux/slices/formSlice').Slot} Slot */

/**
 * Mock appointment availability response.
 *
 * Based on API spec: GET /vass/v0/appointment-availability
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/initiatives/solid-start-scheduling/engineering/api-specification.md#get-vassv0appointment-availablity
 *
 * @export
 * @class MockAppointmentAvailabilityResponse
 */
export default class MockAppointmentAvailabilityResponse {
  /**
   * Creates an instance of MockAppointmentAvailabilityResponse.
   *
   * @param {Object} props - Properties used to create the mock response.
   * @param {string} [props.appointmentId='e61e1a40-1e63-f011-bec2-001dd80351ea'] - Unique identifier for the appointment.
   * @param {Slot[]} [props.availableSlots=[]] - Array of available time slots.
   * @memberof MockAppointmentAvailabilityResponse
   */
  constructor({
    appointmentId = 'e61e1a40-1e63-f011-bec2-001dd80351ea',
    availableSlots = [],
  } = {}) {
    this.data = createAppointmentAvailabilityResponse({
      appointmentId,
      availableSlots,
    });
  }

  /**
   * Returns the response as a plain object.
   *
   * @returns {{ data: { appointmentId: string, availableSlots: Slot[] } }} The mock response object.
   * @memberof MockAppointmentAvailabilityResponse
   */
  toJSON() {
    return this.data;
  }

  /**
   * Creates a time slot object.
   *
   * @static
   * @param {Object} props - Slot properties.
   * @param {string} props.dtStartUtc - ISO8601 UTC datetime string for slot start.
   * @param {string} props.dtEndUtc - ISO8601 UTC datetime string for slot end.
   * @returns {Slot} Time slot object.
   * @memberof MockAppointmentAvailabilityResponse
   */
  static createSlot({ dtStartUtc, dtEndUtc }) {
    return { dtStartUtc, dtEndUtc };
  }

  /**
   * Creates an array of time slots for the next few days.
   *
   * @static
   * @param {Object} props - Options for slot generation.
   * @param {number} [props.numberOfSlots=5] - Number of slots to generate.
   * @param {number} [props.slotDurationMinutes=30] - Duration of each slot in minutes.
   * @param {Date} [props.startDate] - Start date for slots (defaults to tomorrow).
   * @returns {Slot[]} Array of time slot objects.
   * @memberof MockAppointmentAvailabilityResponse
   */
  static createSlots({
    numberOfSlots = 5,
    slotDurationMinutes = 30,
    startDate = new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  } = {}) {
    const slots = [];
    const currentDate = new Date(startDate);
    currentDate.setHours(9, 0, 0, 0); // Start at 9 AM

    for (let i = 0; i < numberOfSlots; i += 1) {
      const dtStartUtc = currentDate.toISOString();
      currentDate.setMinutes(currentDate.getMinutes() + slotDurationMinutes);
      const dtEndUtc = currentDate.toISOString();

      slots.push({ dtStartUtc, dtEndUtc });

      // Add a gap between slots
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    return slots;
  }

  /**
   * Creates an appointment already booked error response.
   *
   * @static
   * @param {Object} props - Error properties.
   * @param {string} [props.appointmentId] - The booked appointment ID.
   * @param {string} [props.dtStartUTC] - Appointment start time.
   * @param {string} [props.dtEndUTC] - Appointment end time.
   * @returns {Object} The error response object.
   * @memberof MockAppointmentAvailabilityResponse
   */
  static createAppointmentAlreadyBookedError({
    appointmentId,
    dtStartUTC,
    dtEndUTC,
  } = {}) {
    return createAppointmentAlreadyBookedError({
      appointmentId,
      dtStartUTC,
      dtEndUTC,
    });
  }

  /**
   * Creates a not within cohort error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentAvailabilityResponse
   */
  static createNotWithinCohortError() {
    return createNotWithinCohortError();
  }

  /**
   * Creates a no slots available error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentAvailabilityResponse
   */
  static createNoSlotsAvailableError() {
    return createNoSlotsAvailableError();
  }

  /**
   * Creates an unauthorized error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentAvailabilityResponse
   */
  static createUnauthorizedError() {
    return createUnauthorizedError();
  }

  /**
   * Creates a VASS API error response (Bad Gateway).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentAvailabilityResponse
   */
  static createVassApiError() {
    return createVassApiError();
  }

  /**
   * Creates a service error response (Service Unavailable).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockAppointmentAvailabilityResponse
   */
  static createServiceError() {
    return createServiceError();
  }
}
