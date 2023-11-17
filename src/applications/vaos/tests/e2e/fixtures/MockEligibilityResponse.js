/**
 * Mock eligibility class.
 *
 * @export
 * @class MockEligibilityResponse
 */
export default class MockEligibilityResponse {
  static PATIENT_HISTORY_INSUFFICIENT = 'patient-history-insufficient';

  static FACILITY_REQUEST_LIMIT_EXCEEDED = 'facility-request-limit-exceeded';

  /**
   * Creates an instance of MockEligibilityResponse.
   *
   * @param {Object} arguments - Arguments used to determine what type of mock eligibility response object to create.
   * @param {string} facilityId - Facility id.
   * @param {String} typeOfCare - Type of care.
   * @param {Boolean} [isEligible=true]  - Flag to determine eligibility or not.
   * @param {string} ineligibilityReason - Ineligibility reason.
   * @memberof MockEligibilityResponse
   */
  constructor({
    facilityId,
    typeOfCare: clinicalServiceId,
    isEligible,
    type,
    ineligibilityReason,
  }) {
    this.id = facilityId.toString();
    this.type = 'MockEligibilityResponse';
    this.attributes = {
      clinicalServiceId,
      eligible: isEligible,
      ineligibilityReasons: ineligibilityReason
        ? [
            {
              coding: [
                {
                  code: ineligibilityReason,
                },
              ],
            },
          ]
        : undefined,
      type,
    };
  }

  /**
   * Method to create a patient history insufficient error response.
   *
   * @static
   * @param {Object} arguments - Method arguments
   * @param {string} arguments.type - Appointment scheduling type: 'direct' or 'request'.
   * @returns Instance of MockEligibilityResponse
   * @memberof MockEligibilityResponse
   */
  static createPatientHistoryInsufficientResponse({ type } = {}) {
    return new MockEligibilityResponse({
      facilityId: '983',
      typeOfCare: 'primaryCare',
      type,
      isEligible: true,
      ineligibilityReason: MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
    });
  }

  /**
   * Method to create a facility request limit exceeded error response.
   *
   * @static
   * @param {Object} arguments - Method arguments
   * @param {string} arguments.type - Appointment scheduling type: 'direct' or 'request'.
   * @returns Instance of MockEligibilityResponse
   * @memberof MockEligibilityResponse
   */
  static createFacilityRequestLimitExceededResponse({ type } = {}) {
    return new MockEligibilityResponse({
      facilityId: '983',
      typeOfCare: 'primaryCare',
      type,
      isEligible: true,
      ineligibilityReason:
        MockEligibilityResponse.FACILITY_REQUEST_LIMIT_EXCEEDED,
    });
  }

  setEligibility(boolean) {
    this.attributes.eligible = boolean;
  }
}
