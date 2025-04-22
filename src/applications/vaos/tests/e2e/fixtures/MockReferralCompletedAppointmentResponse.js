/* eslint-disable camelcase */
import { addDays, format } from 'date-fns';

/**
 * Class to create mock completed appointment responses for Cypress tests
 */
class MockReferralCompletedAppointmentResponse {
  constructor(options = {}) {
    this.options = {
      appointmentId: 'EEKoGzEf',
      typeOfCare: 'Physical Therapy',
      providerName: 'Dr. Bones',
      organizationName: 'Meridian Health',
      appointmentDate: addDays(new Date(), 30),
      modality: 'Office Visit',
      ...options,
    };
  }

  /**
   * Creates a successful completed appointment response
   *
   * @param {Object} options - Options for the response
   * @param {string} options.appointmentId - ID for the appointment
   * @param {string} options.typeOfCare - Type of care for the appointment
   * @param {string} options.providerName - Name of the provider
   * @param {string} options.organizationName - Name of the provider organization
   * @param {Date} options.appointmentDate - Date and time of the appointment
   * @param {string} options.modality - Appointment modality (e.g., 'Office Visit')
   * @returns {Object} A completed appointment response object
   */
  static createSuccessResponse({
    appointmentId = 'EEKoGzEf',
    typeOfCare = 'Physical Therapy',
    providerName = 'Dr. Bones',
    organizationName = 'Meridian Health',
    appointmentDate = addDays(new Date(), 30),
    modality = 'Office Visit',
  } = {}) {
    const formattedDate = format(appointmentDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");

    return {
      data: {
        id: appointmentId,
        type: 'eps_appointments',
        attributes: {
          id: appointmentId,
          status: null,
          start: formattedDate,
          typeOfCare,
          isLatest: true,
          lastRetrieved: formattedDate,
          modality,
        },
        provider: {
          id: 'test-provider-id',
          name: providerName,
          isActive: true,
          phoneNumber: '555-555-5555',
          organization: {
            name: organizationName,
          },
          location: {
            name: 'Test Medical Complex',
            address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
            latitude: 33.058736,
            longitude: -80.032819,
            timezone: 'America/New_York',
          },
          networkIds: ['sandbox-network-test'],
        },
      },
    };
  }

  /**
   * Creates an error response for completed appointment
   *
   * @param {Object} options - Options for the error response
   * @param {string} options.code - Error code
   * @param {string} options.title - Error title
   * @param {string} options.detail - Error detail message
   * @returns {Object} An error response object
   */
  static createErrorResponse({
    code = '404',
    title = 'Appointment not found',
    detail = 'The requested appointment could not be found',
  } = {}) {
    return {
      errors: [
        {
          title,
          detail,
          code,
          status: code,
        },
      ],
    };
  }

  /**
   * Gets the response object based on configuration
   *
   * @returns {Object} The complete response object
   */
  toJSON() {
    const {
      appointmentId,
      typeOfCare,
      providerName,
      organizationName,
      appointmentDate,
      modality,
    } = this.options;

    return MockReferralCompletedAppointmentResponse.createSuccessResponse({
      appointmentId,
      typeOfCare,
      providerName,
      organizationName,
      appointmentDate,
      modality,
    });
  }
}

export default MockReferralCompletedAppointmentResponse;
