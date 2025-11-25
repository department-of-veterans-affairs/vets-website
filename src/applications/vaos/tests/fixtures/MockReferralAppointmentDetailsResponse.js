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
   * @param {string} options.status - Appointment status ('booked', 'cancelled', 'draft')
   * @param {Object} options.cancelationReason - Cancellation reason when status is cancelled
   * @returns {Object} A successful response object
   */
  static createSuccessResponse({
    appointmentId = 'EEKoGzEf',
    organizationName = 'Meridian Health',
    status = 'booked',
    cancelationReason = null,
  } = {}) {
    const baseAttributes = {
      id: appointmentId,
      status,
      start: new Date(
        new Date().setDate(new Date().getDate() + 30),
      ).toISOString(), // 30 days in future
      isLatest: true,
      lastRetrieved: new Date().toISOString(),
    };

    // Only include modality and provider when status is 'booked' or 'cancelled'
    const bookedAttributes =
      status === 'booked' || status === 'cancelled'
        ? {
            modality: 'In Person',
            provider: {
              id: 'test-provider-id',
              location: {
                name: 'FHA South Melbourne Medical Complex',
                address: organizationName,
                latitude: 28.08061,
                longitude: -80.60322,
                timezone: 'America/New_York',
              },
            },
          }
        : {};

    // Add cancellation reason if status is cancelled
    const cancelledAttributes =
      status === 'cancelled' && cancelationReason ? { cancelationReason } : {};

    return {
      data: {
        id: appointmentId,
        type: 'epsAppointment',
        attributes: {
          ...baseAttributes,
          ...bookedAttributes,
          ...cancelledAttributes,
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
      cancelationReason = null,
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
      cancelationReason,
    });
  }
}

module.exports = MockReferralAppointmentDetailsResponse;
