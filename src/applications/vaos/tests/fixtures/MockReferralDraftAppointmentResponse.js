import { addDays, addMonths, setDate } from 'date-fns';
import { mockToday } from '../mocks/constants';

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
   * Creates a draftAppointment object
   *
   * @param {Object} options - Options for the draft appointment
   * @param {string} options.referralNumber - The referral Number
   * @param {string} options.typeOfCare - Type of care
   * @returns {Object} A draft appointment object
   */
  static createDraftAppointment({
    referralNumber = 'PmDYsBz-egEtG13flMnHUQ==',
    typeOfCare = 'Physical Therapy',
  } = {}) {
    const providerId = `provider-${Math.random()
      .toString(36)
      .substring(2, 10)}`;
    const locationId = `location-${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    return {
      id: `draft-${Math.random()
        .toString(36)
        .substring(2, 10)}`,
      type: 'appointments',
      attributes: {
        typeOfCare,
        appointmentType: 'COMMUNITY_CARE',
        status: 'BOOKED',
        schedulingMethod: 'direct',
        referralNumber,
        reasonForVisit: 'Follow-up/Routine',
        providerId,
        locationId,
        timezone: 'America/New_York',
      },
      relationships: {
        location: {
          data: {
            id: locationId,
            type: 'ccLocations',
          },
        },
        provider: {
          data: {
            id: providerId,
            type: 'ccProviders',
          },
        },
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
      numberOfSlots,
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

    // Create slots array with all dates in the next month
    const slotsArray = [];
    const startHour = 14; // Starting at 2 PM UTC

    // Get first day of next month
    // Use a fixed date instead of new Date() to avoid flaky tests
    const firstDayNextMonth = addMonths(setDate(mockToday, 1), 1);

    for (let i = 0; i < numberOfSlots; i++) {
      // Create slots on consecutive days starting from the first day of next month
      const slotDate = addDays(firstDayNextMonth, i);
      slotDate.setHours(startHour + (i % 3), 0, 0, 0); // Vary the hours but keep them reasonable

      slotsArray.push(
        MockReferralDraftAppointmentResponse.createSlot({
          startDate: slotDate,
          index: i,
        }),
      );
    }

    // Create provider
    const provider = MockReferralDraftAppointmentResponse.createProvider();

    // Update provider's location to match the new format (removing the name property)
    const { ...locationWithoutName } = provider.location;
    delete locationWithoutName.name;
    provider.location = locationWithoutName;

    // Return complete response matching the expected format
    return {
      data: {
        id: 'EEKoGzEf',
        type: 'draft_appointment',
        attributes: {
          provider,
          slots: slotsArray,
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

export default MockReferralDraftAppointmentResponse;
