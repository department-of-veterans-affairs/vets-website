import { format, addMonths } from 'date-fns';

/**
 * Class to create mock referral detail responses for Cypress tests
 */
class MockReferralDetailResponse {
  constructor(options = {}) {
    this.options = {
      id: `referral-${Math.random()
        .toString(36)
        .substring(2, 10)}`,
      categoryOfCare: 'Physical Therapy',
      hasAppointments: false,
      notFound: false,
      serverError: false,
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
    categoryOfCare = 'Physical Therapy',
    hasAppointments = false,
    referralNumber = 'VA0000005681',
    expirationDate = format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
    referralDate = format(new Date(), 'yyyy-MM-dd'),
    stationId = '552',
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
          provider: {
            name: 'A & D HEALTH CARE PROFS',
            npi: '1346206547',
            phone: '(937) 236-6750',
            location: 'A & D HEALTH CARE PROFS',
          },
          referringFacility: {
            name: 'Dayton VA Medical Center',
            phone: '(937) 262-3800',
            code: stationId,
            address: {
              street1: '4100 West Third Street',
              city: 'DAYTON',
              state: null,
              zip: '45428',
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
    });
  }
}

export default MockReferralDetailResponse;
