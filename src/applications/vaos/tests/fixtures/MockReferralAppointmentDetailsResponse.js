/**
 * Class to create mock appointment details responses for Cypress tests
 */
class MockReferralAppointmentDetailsResponse {
  constructor(options = {}) {
    this.options = {
      appointmentId: 'EEKoGzEf',
      success: true,
      notFound: false,
      serverError: false,
      ...options,
    };
  }

  /**
   * Creates a successful appointment details response
   *
   * @param {Object} options - Options for the response
   * @param {string} options.appointmentId - ID for the appointment
   * @param {string} options.referralNumber - ID for the referral
   * @param {string} options.typeOfCare - Type of care for the appointment
   * @param {string} options.providerName - Name of the provider
   * @param {string} options.organizationName - Name of the provider organization
   * @returns {Object} A successful response object
   */
  static createSuccessResponse({
    appointmentId = 'EEKoGzEf',
    organizationName = 'Meridian Health',
    status = 'booked',
  } = {}) {
    // TODO update success response
    const baseAttributes = {
      id: appointmentId,
      status,
      start: new Date(
        new Date().setDate(new Date().getDate() + 30),
      ).toISOString(), // 30 days in future
      isLatest: true,
      lastRetrieved: new Date().toISOString(),
      referralId: '123abc',
      past: false,
    };

    // Only include modality and provider when status is 'booked'
    const bookedAttributes =
      status === 'booked'
        ? {
            modality: 'communityCareEps',
            provider: {
              id: 'test-provider-id',
              name: 'Dr. Smith @ Acme Cardiology - Anywhere, USA',
              practice: 'Acme Cardiology',
              phone: '555-555-0001',
              location: {
                name: organizationName,
                address:
                  '7500 CENTRAL AVE, STE 108, PHILADELPHIA, PA 19111-2430',
                latitude: 40.06999282694126,
                longitude: -75.08769957031448,
                timezone: 'America/New_York',
              },
            },
            location: {
              id: 'test-location-id',
              type: 'appointments',
              attributes: {
                name: organizationName,
                timezone: {
                  timeZoneId: 'America/New_York',
                },
              },
            },
          }
        : {};

    return {
      data: {
        id: appointmentId,
        type: 'epsAppointment',
        attributes: {
          ...baseAttributes,
          ...bookedAttributes,
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
          detail: 'An error occurred while retrieving appointment details',
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
      typeOfCare = 'Physical Therapy',
      providerName = 'Dr. Bones',
      organizationName = 'Meridian Health',
      success,
      notFound,
      serverError,
      status = 'booked',
    } = this.options;

    // Return 404 error if notFound is true
    if (notFound) {
      return MockReferralAppointmentDetailsResponse.create404Response(
        appointmentId,
      );
    }

    // Return 500 error if serverError is true
    if (serverError) {
      return MockReferralAppointmentDetailsResponse.create500Response();
    }

    // Return error response if success is false
    if (!success) {
      return MockReferralAppointmentDetailsResponse.createErrorResponse();
    }

    // Return successful response
    return MockReferralAppointmentDetailsResponse.createSuccessResponse({
      appointmentId,
      typeOfCare,
      providerName,
      organizationName,
      status,
    });
  }
}

module.exports = MockReferralAppointmentDetailsResponse;
