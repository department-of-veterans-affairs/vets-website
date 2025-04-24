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
      notFound: false,
      serverError: false,
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
   * Creates a 404 Not Found error response
   *
   * @param {string} appointmentId - ID of the appointment that wasn't found
   * @returns {Object} A 404 error response object
   */
  static create404Response(appointmentId = 'EEKoGzEf') {
    return {
      errors: [
        {
          title: 'Appointment not found',
          detail: `Appointment with ID ${appointmentId} was not found`,
          code: '404',
          status: '404',
        },
      ],
    };
  }

  /**
   * Creates a 500 Internal Server Error response
   *
   * @returns {Object} A 500 error response object
   */
  static create500Response() {
    return {
      errors: [
        {
          title: 'Internal Server Error',
          detail: 'An error occurred while retrieving the appointment',
          code: '500',
          status: '500',
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
      notFound,
      serverError,
    } = this.options;

    // Return 404 error if notFound is true
    if (notFound) {
      return MockReferralCompletedAppointmentResponse.create404Response(
        appointmentId,
      );
    }

    // Return 500 error if serverError is true
    if (serverError) {
      return MockReferralCompletedAppointmentResponse.create500Response();
    }

    // Return successful response
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
