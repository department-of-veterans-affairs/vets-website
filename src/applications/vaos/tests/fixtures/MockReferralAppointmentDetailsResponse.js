/**
 * Class to create mock appointment details responses for Cypress tests
 */
class MockReferralAppointmentDetailsResponse {
  constructor(options = {}) {
    this.options = {
      appointmentId: 'EEKoGzEf',
      referralNumber: '12345',
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
    referralNumber = '12345',
    typeOfCare = 'Physical Therapy',
    providerName = 'Dr. Bones',
    organizationName = 'Meridian Health',
  } = {}) {
    return {
      data: {
        id: appointmentId,
        type: 'cc_appointment',
        attributes: {
          id: appointmentId,
          status: 'booked',
          patientIcn: 'care-nav-patient-casey',
          created: new Date().toISOString(),
          locationId: 'sandbox-network-5vuTac8v',
          clinic: 'Aq7wgAux',
          start: new Date(
            new Date().setDate(new Date().getDate() + 30),
          ).toISOString(), // 30 days in future
          referralNumber,
          facilityName: 'Linda Loma',
          facilityPhone: '555-555-5555',
          typeOfCare,
          modality: 'In Person',
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
          referringFacility: {
            name: 'VA Boston Healthcare System',
            address: {
              street: '150 S Huntington Ave',
              city: 'Boston',
              state: 'MA',
              zipCode: '02130',
            },
            phone: '555-123-4567',
          },
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
      referralNumber,
      typeOfCare = 'Physical Therapy',
      providerName = 'Dr. Bones',
      organizationName = 'Meridian Health',
      success,
      notFound,
      serverError,
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
      referralNumber,
      typeOfCare,
      providerName,
      organizationName,
    });
  }
}

export default MockReferralAppointmentDetailsResponse;
