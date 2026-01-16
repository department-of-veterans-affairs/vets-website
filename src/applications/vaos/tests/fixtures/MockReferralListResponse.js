const { format, addMonths } = require('date-fns');

/**
 * Class to create mock referral list responses for Cypress tests
 */
class MockReferralListResponse {
  constructor(options = {}) {
    this.options = {
      numberOfReferrals: 0,
      predefined: false,
      notFound: false,
      serverError: false,
      ...options,
    };
  }

  /**
   * Creates a single referral object
   *
   * @param {Object} options - Options for the referral
   * @param {string} options.id - UUID for the referral
   * @param {string} options.categoryOfCare - Type of care
   * @param {string} options.referralNumber - Referral number
   * @param {string} options.expirationDate - Date in YYYY-MM-DD format
   * @returns {Object} A referral object
   */
  static createReferral({
    id = `referral-${Math.random()
      .toString(36)
      .substring(2, 10)}`,
    categoryOfCare = 'OPTOMETRY',
    referralNumber = `VA${Math.floor(1000 + Math.random() * 9000)}`,
    expirationDate = format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
    stationId = '659',
    referralConsultId = `${stationId}_${Math.floor(
      100000 + Math.random() * 900000,
    )}`,
  } = {}) {
    return {
      id,
      type: 'referrals',
      attributes: {
        stationId,
        categoryOfCare,
        referralNumber,
        referralConsultId,
        uuid: id,
        expirationDate,
      },
    };
  }

  /**
   * Creates a list of predefined referrals
   *
   * @returns {Array} List of referral objects
   */
  static getPredefinedReferrals() {
    const today = new Date();
    const formatStr = 'yyyy-MM-dd';

    return [
      MockReferralListResponse.createReferral({
        id: 'PmDYsBz-egEtG13flMnHUQ==',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'VA0000005682',
        expirationDate: format(addMonths(today, 2), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'oSI3vEVkzuR-JJomdWA6Fw==',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'VA0000006569',
        expirationDate: format(addMonths(today, 6), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
        categoryOfCare: 'CHIROPRACTIC',
        referralNumber: 'VA0000007123',
        expirationDate: format(addMonths(today, 5), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'out-of-pilot-station',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'VA0000007123',
        expirationDate: format(addMonths(today, 5), formatStr),
        stationId: '123',
      }),
      MockReferralListResponse.createReferral({
        id: 'appointment-submit-error',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'appointment-submit-error',
        expirationDate: format(addMonths(today, 5), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'poll-retry-error',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'poll-retry-error',
        expirationDate: format(addMonths(today, 5), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'poll-error',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'poll-error',
        expirationDate: format(new Date(2024, 12, 2), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'draft-no-slots-error',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'draft-no-slots-error',
        expirationDate: format(new Date(2024, 12, 2), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'referral-without-provider-error',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'VA0000007123',
        expirationDate: format(addMonths(today, 5), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'details-not-found-error',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'details-not-found-error',
        expirationDate: format(new Date(2024, 12, 2), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'details-error',
        categoryOfCare: 'OPTOMETRY',
        referralNumber: 'details-error',
        expirationDate: format(new Date(2024, 12, 2), formatStr),
      }),
    ];
  }

  /**
   * Creates a list of randomly generated referrals
   *
   * @param {number} count - Number of referrals to generate
   * @returns {Array} List of referral objects
   */
  static getRandomReferrals(count = 3) {
    const referrals = [];
    for (let i = 0; i < count; i++) {
      // Use OPTOMETRY and CHIROPRACTIC to test chiro flipper
      const categoryOfCare = i % 2 === 0 ? 'OPTOMETRY' : 'CHIROPRACTIC';
      referrals.push(
        MockReferralListResponse.createReferral({ categoryOfCare }),
      );
    }
    return referrals;
  }

  /**
   * Creates a 404 Not Found error response
   *
   * @returns {Object} A 404 error response object
   */
  static create404Response() {
    return {
      errors: [
        {
          title: 'Referrals not found',
          detail: 'No referrals were found for this patient',
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
          detail: 'An error occurred while retrieving referrals',
          code: '500',
          status: '500',
        },
      ],
    };
  }

  /**
   * Gets the response object with referrals
   *
   * @returns {Object} The complete response object with referrals
   */
  toJSON() {
    const {
      numberOfReferrals,
      notFound,
      serverError,
      predefined,
    } = this.options;

    // Return 404 error if notFound is true
    if (notFound) {
      return MockReferralListResponse.create404Response();
    }

    // Return 500 error if serverError is true
    if (serverError) {
      return MockReferralListResponse.create500Response();
    }

    // If predefined referrals are requested
    if (predefined) {
      return { data: MockReferralListResponse.getPredefinedReferrals() };
    }

    // If number of referrals is 0, return empty array
    if (numberOfReferrals === 0) {
      return { data: [] };
    }

    // Otherwise generate random referrals
    return {
      data: MockReferralListResponse.getRandomReferrals(numberOfReferrals),
    };
  }
}

// export default MockReferralListResponse;
module.exports = MockReferralListResponse;
