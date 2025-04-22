/* eslint-disable camelcase */

/**
 * Class to create mock submit appointment responses for Cypress tests
 */
class MockReferralSubmitAppointmentResponse {
  constructor(options = {}) {
    this.options = {
      appointmentId: 'EEKoGzEf',
      success: true,
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
    const { appointmentId, success } = this.options;

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

export default MockReferralSubmitAppointmentResponse;
