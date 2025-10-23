const { addDays } = require('date-fns');
const { getMockSlots } = require('../../services/mocks/utils/slots');
const {
  getMockConfirmedAppointments,
  findNextBusinessDay,
} = require('../../services/mocks/utils/confirmedAppointments');

/**
 * Class to create mock draft referral appointment responses for Cypress tests.
 * Note the appointment slots are created in the next month to make sure we can test
 * for all slots and get around slots crossing over a month boundary.
 */
class MockReferralDraftAppointmentResponse {
  constructor(options = {}) {
    this.options = {
      referralNumber: 'PmDYsBz-egEtG13flMnHUQ==',
      categoryOfCare: 'Physical Therapy',
      notFound: false,
      serverError: false,
      numberOfSlots: 3,
      startDate: null,
      currentDate: null,
      ...options,
    };
  }

  /**
   * Creates a single appointment slot
   *
   * @param {Object} options - Options for the slot
   * @param {Date} options.startDate - Start date and time for the slot
   * @param {number} options.index - Index for the slot
   * @returns {Object} An appointment slot object
   */
  static createSlot({ startDate = addDays(new Date(), 5), index = 0 } = {}) {
    return {
      id: `5vuTac8v-practitioner-1-role-2|e43a19a8-b0cb-4dcf-befa-8cc511c3999b|2025-01-02T15:30:00Z|30m0s|1736636444704|ov${index}`,
      providerServiceId: '9mN718pH',
      appointmentTypeId: 'ov',
      start: startDate.toISOString(),
      remaining: 1,
    };
  }

  /**
   * Creates a provider object
   *
   * @param {Object} options - Options for the provider
   * @param {string} options.id - UUID for the provider
   * @returns {Object} A provider object
   */
  static createProvider({ id = '9mN718pH' } = {}) {
    return {
      id,
      name: 'Dr. Bones @ FHA South Melbourne Medical Complex',
      isActive: true,
      individualProviders: [
        {
          name: 'Dr. Bones',
          npi: '91560381x',
        },
      ],
      providerOrganization: {
        name: 'Meridian Health (Sandbox 5vuTac8v)',
      },
      location: {
        name: 'FHA South Melbourne Medical Complex',
        address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
        latitude: 28.08061,
        longitude: -80.60322,
        timezone: 'America/New_York',
      },
      networkIds: ['sandboxnetwork-5vuTac8v'],
      schedulingNotes:
        'New patients need to send their previous records to the office prior to their appt.',
      appointmentTypes: [
        {
          id: 'ov',
          name: 'Office Visit',
          isSelfSchedulable: true,
        },
      ],
      specialties: [
        {
          id: '208800000X',
          name: 'Urology',
        },
      ],
      visitMode: 'phone',
      features: {
        isDigital: true,
        directBooking: {
          isEnabled: true,
          requiredFields: ['phone', 'address', 'name', 'birthdate', 'gender'],
        },
      },
    };
  }

  /**
   * Creates a location object
   *
   * @param {Object} options - Options for the location
   * @param {string} options.id - UUID for the location
   * @param {string} options.name - Location name
   * @param {Object} options.address - Location address
   * @returns {Object} A location object
   */
  static createLocation({
    id = `location-${Math.random()
      .toString(36)
      .substring(2, 10)}`,
    name = 'ACME PHYSICAL THERAPY',
    address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
    },
  } = {}) {
    return {
      id,
      type: 'ccLocations',
      attributes: {
        name,
        identifier: id,
        address,
      },
    };
  }

  /**
   * Creates a 404 Not Found error response
   *
   * @param {string} referralNumber - ID of the referral that wasn't found
   * @returns {Object} A 404 error response object
   */
  static create404Response(referralNumber = 'PmDYsBz-egEtG13flMnHUQ==') {
    return {
      errors: [
        {
          title: 'Referral not found',
          detail: `Referral with ID ${referralNumber} was not found`,
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
          detail: 'An error occurred while retrieving the draft appointment',
          code: '500',
          status: '500',
        },
      ],
    };
  }

  /**
   * Gets the response object with draft appointment and slots
   *
   * @returns {Object} The complete response object or error
   */
  toJSON() {
    const {
      referralNumber,
      notFound,
      serverError,
      noSlotsError,
    } = this.options;

    // Return 404 error if notFound is true
    if (notFound) {
      return MockReferralDraftAppointmentResponse.create404Response(
        referralNumber,
      );
    }

    // Return 500 error if serverError is true
    if (serverError) {
      return MockReferralDraftAppointmentResponse.create500Response();
    }

    // Generate dynamic slots with conflicts based on confirmed appointments
    const confirmedAppointmentsv3 = getMockConfirmedAppointments();
    // Find appointments scheduled for the next business day to force conflicts
    const nextBusinessDay = findNextBusinessDay();
    const nextBusinessDayString = nextBusinessDay.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    const nextBusinessDayAppointments = confirmedAppointmentsv3.data.filter(
      appointment => {
        const appointmentDate = appointment.attributes.start.split('T')[0];
        return appointmentDate === nextBusinessDayString;
      },
    );

    // Create provider
    const provider = MockReferralDraftAppointmentResponse.createProvider();

    // Update provider's location to match the new format (removing the name property)
    const { ...locationWithoutName } = provider.location;
    delete locationWithoutName.name;
    provider.location = locationWithoutName;

    // Generate slots unless noSlotsError is true
    let mockSlots;
    if (noSlotsError) {
      mockSlots = [];
    } else {
      mockSlots = getMockSlots({
        existingAppointments: confirmedAppointmentsv3.data,
        futureMonths: 2,
        pastMonths: 0,
        conflictRate: 0,
        forceConflictWithAppointments: nextBusinessDayAppointments,
        communityCareSlots: true,
        currentDate: this.options.currentDate,
      }).data;
    }

    // Return complete response matching the expected format
    return {
      data: {
        id: `appointment-for-${referralNumber}`,
        type: 'draft_appointment',
        attributes: {
          referralNumber,
          provider,
          slots: mockSlots,
          drivetime: {
            origin: {
              latitude: 40.7128,
              longitude: -74.006,
            },
            destination: {
              distanceInMiles: 313,
              driveTimeInSecondsWithoutTraffic: 19096,
              driveTimeInSecondsWithTraffic: 19561,
              latitude: 44.475883,
              longitude: -73.212074,
            },
          },
        },
      },
    };
  }
}

module.exports = MockReferralDraftAppointmentResponse;
