import { format, addMonths } from 'date-fns';

/**
 * Class to create mock referral list responses for Cypress tests
 */
class MockReferralListResponse {
  constructor(options = {}) {
    this.options = {
      numberOfReferrals: 0,
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
    categoryOfCare = 'Physical Therapy',
    referralNumber = `VA${Math.floor(1000 + Math.random() * 9000)}`,
    expirationDate = format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
  } = {}) {
    return {
      id,
      type: 'referrals',
      attributes: {
        categoryOfCare,
        referralNumber,
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
        categoryOfCare: 'Physical Therapy',
        referralNumber: 'VA0000005682',
        expirationDate: format(addMonths(today, 2), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'oSI3vEVkzuR-JJomdWA6Fw==',
        categoryOfCare: 'Physical Therapy',
        referralNumber: 'VA0000006569',
        expirationDate: format(addMonths(today, 6), formatStr),
      }),
      MockReferralListResponse.createReferral({
        id: 'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
        categoryOfCare: 'Physical Therapy',
        referralNumber: 'VA0000007123',
        expirationDate: format(addMonths(today, 5), formatStr),
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
      referrals.push(MockReferralListResponse.createReferral());
    }
    return referrals;
  }

  /**
   * Gets the response object with referrals
   *
   * @returns {Object} The complete response object with referrals
   */
  toJSON() {
    const { numberOfReferrals } = this.options;

    // If number of referrals is 0, return empty array
    if (numberOfReferrals === 0) {
      return { data: [] };
    }

    // If predefined referrals are requested
    if (numberOfReferrals === 'predefined') {
      return { data: MockReferralListResponse.getPredefinedReferrals() };
    }

    // Otherwise generate random referrals
    return {
      data: MockReferralListResponse.getRandomReferrals(numberOfReferrals),
    };
  }
}

export default MockReferralListResponse;
