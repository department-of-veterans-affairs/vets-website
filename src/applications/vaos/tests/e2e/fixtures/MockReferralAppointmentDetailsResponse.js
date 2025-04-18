/**
 * Class to create mock appointment details responses for Cypress tests
 */
class MockReferralAppointmentDetailsResponse {
  constructor(options = {}) {
    this.options = {
      appointmentId: 'EEKoGzEf',
      referralId: '12345',
      success: true,
      ...options,
    };
  }

  /**
   * Creates a successful appointment details response
   *
   * @param {Object} options - Options for the response
   * @param {string} options.appointmentId - ID for the appointment
   * @param {string} options.referralId - ID for the referral
   * @param {string} options.typeOfCare - Type of care for the appointment
   * @param {string} options.providerName - Name of the provider
   * @param {string} options.organizationName - Name of the provider organization
   * @returns {Object} A successful response object
   */
  static createSuccessResponse({
    appointmentId = 'EEKoGzEf',
    referralId = '12345',
    typeOfCare = 'Physical Therapy',
    providerName = 'Dr. Bones',
    organizationName = 'Meridian Health',
  } = {}) {
    return {
      data: {
        appointment: {
          id: appointmentId,
          status: 'booked',
          patientIcn: 'care-nav-patient-casey',
          created: new Date().toISOString(),
          locationId: 'sandbox-network-5vuTac8v',
          clinic: 'Aq7wgAux',
          start: new Date(
            new Date().setDate(new Date().getDate() + 30),
          ).toISOString(), // 30 days in future
          referralId,
          referral: {
            referralNumber: referralId,
            facilityName: 'Linda Loma',
            facilityPhone: '555-555-5555',
            typeOfCare,
            modality: 'In Person',
          },
        },
        provider: {
          id: 'test-provider-id',
          name: providerName,
          isActive: true,
          individualProviders: [
            {
              name: providerName,
              npi: 'test-npi',
            },
          ],
          providerOrganization: {
            name: organizationName,
          },
          location: {
            name: 'Test Medical Complex',
            address: '207 Davishill Ln',
            latitude: 33.058736,
            longitude: -80.032819,
            timezone: 'America/New_York',
          },
          networkIds: ['sandbox-network-test'],
          schedulingNotes:
            'New patients need to send their previous records to the office prior to their appt.',
          appointmentTypes: [
            {
              id: 'off',
              name: 'Office Visit',
              isSelfSchedulable: true,
            },
          ],
          specialties: [
            {
              id: 'test-id',
              name: 'Urology',
            },
          ],
          visitMode: 'phone',
          features: null,
        },
      },
    };
  }

  /**
   * Creates an error response for appointment details
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
      referralId,
      typeOfCare = 'Physical Therapy',
      providerName = 'Dr. Bones',
      organizationName = 'Meridian Health',
      success,
    } = this.options;

    // Return error response if success is false
    if (!success) {
      return MockReferralAppointmentDetailsResponse.createErrorResponse();
    }

    // Return successful response
    return MockReferralAppointmentDetailsResponse.createSuccessResponse({
      appointmentId,
      referralId,
      typeOfCare,
      providerName,
      organizationName,
    });
  }
}

export default MockReferralAppointmentDetailsResponse;
