import { INELIGIBILITY_CODES_VAOS } from '../../utils/constants';

/**
 * Mock eligibility response.
 *
 * @export
 * @class MockEligibilityResponse
 */
export default class MockEligibilityResponse {
  // Make codes accessible as part of response class
  static PATIENT_HISTORY_INSUFFICIENT =
    INELIGIBILITY_CODES_VAOS.PATIENT_HISTORY_INSUFFICIENT;

  static FACILITY_REQUEST_LIMIT_EXCEEDED =
    INELIGIBILITY_CODES_VAOS.REQUEST_LIMIT_EXCEEDED;

  static DIRECT_DISABLED = INELIGIBILITY_CODES_VAOS.DIRECT_SCHEDULING_DISABLED;

  static REQUEST_DISABLED =
    INELIGIBILITY_CODES_VAOS.REQUEST_SCHEDULING_DISABLED;

  /**
   * Creates an instance of MockEligibilityResponse.
   *
   * @param {Object} arguments - Arguments used to determine what type of mock eligibility response object to create.
   * @param {String} [arguments.facilityId=983] - Facility id. Default: 983
   * @param {String} [arguments.typeOfCareId=primaryCare] - Type of care id. Default: 'primaryCare'
   * @param {String} [arguments.type] - Appointment scheduling type: 'direct' or 'request'.
   * @param {String} [arguments.ineligibilityReason] - Ineligibility reason.
   * @memberof MockEligibilityResponse
   */
  constructor({
    facilityId = '983',
    typeOfCareId: clinicalServiceId = 'primaryCare',
    type,
    ineligibilityReason,
  }) {
    this.id = facilityId.toString();
    this.type = 'MockEligibilityResponse';
    this.attributes = {
      clinicalServiceId,
      eligible: !ineligibilityReason,
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

  // All remaining responses make eligibility false

  /**
   * Method to create a patient history insufficient error response.
   *
   * @static
   * @param {Object} arguments - Method arguments
   * @param {string} [arguments.type=direct] - Appointment scheduling type: 'direct' or 'request', defaults to direct.
   * @param {string} [arguments.facilityId=983] - Facility id. Default: 983
   * @param {string} [arguments.typeOfCareId=primaryCare] - Type of care id. Default: 'primaryCare'
   * @returns Instance of MockEligibilityResponse
   * @memberof MockEligibilityResponse
   */
  static createPatientHistoryInsufficientResponse({
    type = 'direct',
    facilityId = '983',
    typeOfCareId = 'primaryCare',
  }) {
    return new MockEligibilityResponse({
      facilityId,
      typeOfCareId,
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
   * @param {string} [arguments.facilityId=983] - Facility id. Default: 983
   * @param {string} [arguments.typeOfCareId=primaryCare] - Type of care id. Default: 'primaryCare'
   * @returns Instance of MockEligibilityResponse
   * @memberof MockEligibilityResponse
   */
  static createFacilityRequestLimitExceededResponse({
    type,
    facilityId = '983',
    typeOfCareId = 'primaryCare',
  }) {
    return new MockEligibilityResponse({
      facilityId,
      typeOfCareId,
      type,
      isEligible: false,
      ineligibilityReason:
        MockEligibilityResponse.FACILITY_REQUEST_LIMIT_EXCEEDED,
    });
  }

  /**
   * Method to create a facility scheduling disabled error response.
   *
   * @static
   * @param {Object} arguments - Method arguments
   * @param {string} [arguments.type=direct] - Appointment scheduling type: 'direct' or 'request', defaults to direct.
   * @param {string} [arguments.facilityId=983] - Facility id. Default: 983
   * @param {string} [arguments.typeOfCareId=primaryCare] - Type of care id. Default: 'primaryCare'
   * @returns Instance of MockEligibilityResponse
   * @memberof MockEligibilityResponse
   */
  static createEligibilityDisabledResponse({
    type = 'direct',
    facilityId = '983',
    typeOfCareId = 'primaryCare',
  }) {
    return new MockEligibilityResponse({
      facilityId,
      typeOfCareId,
      type,
      isEligible: false,
      ineligibilityReason:
        type === 'direct'
          ? MockEligibilityResponse.DIRECT_DISABLED
          : MockEligibilityResponse.REQUEST_DISABLED,
    });
  }

  /**
   * Method to create a direct scheduling eligibility response.
   *
   * @static
   * @param {Object} arguments - Method arguments
   * @param {string} [arguments.facilityId=983] - Facility id. Default: 983
   * @param {string} [arguments.ineligibilityReason] - Ineligibility reason.
   * @param {string} [arguments.typeOfCareId] - Type of care id. Default: 'primaryCare'
   * @returns Instance of MockEligibilityResponse
   * @memberof MockEligibilityResponse
   */
  static createEligibilityDirectResponse({
    facilityId,
    ineligibilityReason,
    typeOfCareId,
  } = {}) {
    return new MockEligibilityResponse({
      facilityId,
      ineligibilityReason,
      type: 'direct',
      typeOfCareId,
    });
  }

  /**
   * Method to create a request scheduling eligibility response.
   *
   * @static
   * @param {Object} arguments - Method arguments
   * @param {string} [arguments.facilityId=983] - Facility id. Default: 983
   * @param {string} [arguments.ineligibilityReason] - Ineligibility reason.
   * @param {string} [arguments.typeOfCareId] - Type of care id. Default: 'primaryCare'
   * @returns Instance of MockEligibilityResponse
   * @memberof MockEligibilityResponse
   */
  static createEligibilityRequestResponse({
    facilityId,
    ineligibilityReason,
    typeOfCareId,
  } = {}) {
    return new MockEligibilityResponse({
      facilityId,
      ineligibilityReason,
      type: 'request',
      typeOfCareId,
    });
  }

  setEligibility(boolean) {
    this.attributes.eligible = boolean;
  }
}
