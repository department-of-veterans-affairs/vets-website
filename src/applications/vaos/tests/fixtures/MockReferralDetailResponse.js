const { format, addMonths } = require('date-fns');

/**
 * Class to create mock referral detail responses for Cypress tests
 */
class MockReferralDetailResponse {
  constructor(options = {}) {
    this.options = {
      id: `referral-${Math.random()
        .toString(36)
        .substring(2, 10)}`,
      categoryOfCare: 'OPTOMETRY',
      hasAppointments: false,
      notFound: false,
      serverError: false,
      referralNumber: 'VA0000005681',
      provider: {
        name: 'Dr. Moreen S. Rafa',
        npi: '1346206547',
        phone: '(937) 236-6750',
        facilityName: 'fake facility name',
        address: {
          street1: '76 Veterans Avenue',
          city: 'BATH',
          state: null,
          zip: '14810',
        },
      },
      ...options,
    };
  }

  /**
   * Creates a successful referral detail response
   *
   * @param {Object} options - Options for the response
   * @returns {Object} A successful response object
   */
  static createSuccessResponse({
    id = `referral-${Math.random()
      .toString(36)
      .substring(2, 10)}`,
    categoryOfCare = 'OPTOMETRY',
    hasAppointments = false,
    referralNumber = 'VA0000005681',
    expirationDate = this.expirationDate
      ? format(this.expirationDate, 'yyyy-MM-dd')
      : format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
    referralDate = format(new Date(), 'yyyy-MM-dd'),
    stationId = '659',
    provider = {
      name: 'Dr. Moreen S. Rafa',
      npi: '1346206547',
      phone: '(937) 236-6750',
      facilityName: 'fake facility name',
      address: {
        street1: '76 Veterans Avenue',
        city: 'BATH',
        state: null,
        zip: '14810',
      },
    },
  } = {}) {
    return {
      data: {
        id,
        type: 'referrals',
        attributes: {
          uuid: id,
          categoryOfCare,
          status: 'ACTIVE',
          referralNumber,
          expirationDate,
          serviceName: 'Referral',
          hasAppointments,
          referralDate,
          stationId,
          facilityName: 'VAMC Facility',
          facilityPhone: '555-555-5555',
          preferredTimesForPhoneCall: [],
          timezone: 'America/New_York',
          provider,
          referringFacility: {
            name: 'Batavia VA Medical Center',
            phone: '(585) 297-1000',
            code: '528A4',
            address: {
              street1: '222 Richmond Avenue',
              city: 'BATAVIA',
              state: null,
              zip: '14020',
            },
          },
          providerId: null,
          receivingStaffName: null,
          receivingStaffPhone: null,
          referredToName: null,
          sendingStaffEmail: null,
          sendingStaffName: null,
        },
        relationships: {},
      },
    };
  }

  /**
   * Creates a 404 Not Found error response
   *
   * @param {string} referralId - ID of the referral that wasn't found
   * @returns {Object} A 404 error response object
   */
  static create404Response(referralId) {
    return {
      errors: [
        {
          title: 'Referral not found',
          detail: `Referral with ID ${referralId} was not found`,
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
          detail: 'An error occurred while retrieving the referral details',
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
      id,
      categoryOfCare,
      hasAppointments,
      notFound,
      serverError,
      provider,
      referralNumber,
      stationId,
    } = this.options;

    // Return 404 error if notFound is true
    if (notFound) {
      return MockReferralDetailResponse.create404Response(id);
    }

    // Return 500 error if serverError is true
    if (serverError) {
      return MockReferralDetailResponse.create500Response();
    }

    // Return successful response
    return MockReferralDetailResponse.createSuccessResponse({
      id,
      categoryOfCare,
      hasAppointments,
      provider,
      referralNumber,
      stationId,
    });
  }
}

module.exports = MockReferralDetailResponse;
