import { format, addMonths } from 'date-fns';

/**
 * Class to create mock referral detail responses for Cypress tests
 */
class MockReferralDetailResponse {
  constructor(options = {}) {
    this.options = {
      id: 'FeTbI6uhN890QCVc6fCSzw==',
      hasAppointments: false,
      ...options,
    };
  }

  /**
   * Creates a detailed referral object
   *
   * @param {Object} options - Options for the referral
   * @param {string} options.id - UUID for the referral
   * @param {string} options.categoryOfCare - Type of care
   * @param {string} options.referralNumber - Referral number
   * @param {string} options.expirationDate - Date in YYYY-MM-DD format
   * @param {boolean} options.hasAppointments - Whether the referral has appointments
   * @returns {Object} A detailed referral object
   */
  createDetailedReferral({
    id = this.options.id,
    categoryOfCare = 'Physical Therapy',
    referralNumber = 'VA0000005681',
    expirationDate = format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
    hasAppointments = this.options.hasAppointments,
    referralDate = format(new Date(), 'yyyy-MM-dd'),
    stationId = '552',
  } = {}) {
    return {
      id,
      type: 'referrals',
      attributes: {
        uuid: id,
        categoryOfCare,
        referralNumber,
        expirationDate,
        hasAppointments,
        referralDate,
        stationId,
        provider: {
          name: 'A & D HEALTH CARE PROFS',
          npi: '1346206547',
          telephone: '(937) 236-6750',
          location: 'A & D HEALTH CARE PROFS',
        },
        referringFacilityInfo: {
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
      },
    };
  }

  /**
   * Gets the response object with referral details
   *
   * @returns {Object} The complete response object with referral details
   */
  toJSON() {
    return {
      data: this.createDetailedReferral(),
    };
  }
}

export default MockReferralDetailResponse;
