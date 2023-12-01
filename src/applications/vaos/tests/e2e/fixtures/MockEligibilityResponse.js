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
   * @param {String} [arguments.facilityId=983] - Facility id. Default: 983
   * @param {String} [arguments.typeOfCareId=primaryCare] - Type of care id. Default: 'primaryCare'
   * @param {Boolean} [arguments.isEligible=true]  - Flag to determine eligibility or not. Default: true
   * @param {String} [arguments.type] - Appointment scheduling type: 'direct' or 'request'.
   * @param {String} [arguments.ineligibilityReason] - Ineligibility reason.
   * @memberof MockEligibilityResponse
   */
  constructor({
    facilityId = '983',
    typeOfCareId: clinicalServiceId = 'primaryCare',
    isEligible = true,
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
  static createPatientHistoryInsufficientResponse({ type }) {
    return new MockEligibilityResponse({
      facilityId: '983',
      typeOfCareId: 'primaryCare',
      type,
      isEligible: false,
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
  static createFacilityRequestLimitExceededResponse({ type }) {
    return new MockEligibilityResponse({
      facilityId: '983',
      typeOfCareId: 'primaryCare',
      type,
      isEligible: false,
      ineligibilityReason:
        MockEligibilityResponse.FACILITY_REQUEST_LIMIT_EXCEEDED,
    });
  }

  setEligibility(boolean) {
    this.attributes.eligible = boolean;
  }
}
