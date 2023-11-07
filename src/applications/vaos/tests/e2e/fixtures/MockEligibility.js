/**
 * Mock eligibility class.
 *
 * @export
 * @class MockEligibility
 */
export class MockEligibility {
  /**
   * Creates an instance of MockEligibility.
   * @param {Object} arguments - Arguments used to determine what type of mock eligibility response object to create.
   * @param {string} facilityId - Facility id.
   * @param {String} typeOfCare - Type of care.
   * @param {Boolean} [isEligible=true]  - Flag to determine eligibility or not.
   * @memberof MockEligibility
   */
  constructor({ facilityId, typeOfCare: clinicalServiceId, isEligible, type }) {
    this.id = facilityId.toString();
    this.type = 'MockEligibility';
    this.attributes = {
      clinicalServiceId,
      eligible: isEligible,
      ineligibilityReasons: [
        {
          coding: [
            {
              code: 'notSupported',
            },
          ],
        },
      ],
      type,
    };
  }

  setEligibility(boolean) {
    this.attributes.eligible = boolean;
  }
}
