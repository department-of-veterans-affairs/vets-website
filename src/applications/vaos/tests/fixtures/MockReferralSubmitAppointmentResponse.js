/**
 * Class to create mock submit appointment responses for Cypress tests
 */
class MockReferralSubmitAppointmentResponse {
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
   * Creates a successful appointment submission response
   *
   * @param {Object} options - Options for the response
   * @param {string} options.appointmentId - ID for the submitted appointment
   * @returns {Object} A successful response object
   */
  static createSuccessResponse({ appointmentId = 'EEKoGzEf' } = {}) {
    return {
      data: {
        id: appointmentId,
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
          detail: 'An error occurred while submitting the appointment',
          code: '500',
          status: '500',
        },
      ],
    };
  }

  /**
   * Creates an error response for appointment submission
   *
   * @param {Object} options - Options for the error response
   * @param {string} options.code - Error code
   * @param {string} options.title - Error title
   * @param {string} options.detail - Error detail message
   * @returns {Object} An error response object
   */
  static createErrorResponse({
    code = '500',
    title = 'Internal Server Error',
    detail = 'An error occurred while submitting the appointment',
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
    const { appointmentId, success, notFound, serverError } = this.options;

    // Return 404 error if notFound is true
    if (notFound) {
      return MockReferralSubmitAppointmentResponse.create404Response(
        appointmentId,
      );
    }

    // Return 500 error if serverError is true
    if (serverError) {
      return MockReferralSubmitAppointmentResponse.create500Response();
    }

    // Return error response if success is false
    if (!success) {
      return MockReferralSubmitAppointmentResponse.createErrorResponse();
    }

    // Return successful response
    return MockReferralSubmitAppointmentResponse.createSuccessResponse({
      appointmentId,
    });
  }
}

module.exports = MockReferralSubmitAppointmentResponse;
