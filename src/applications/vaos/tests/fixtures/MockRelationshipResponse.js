import { getTypeOfCareById } from '../../utils/appointment';
import { TYPE_OF_CARE_IDS } from '../../utils/constants';

/**
 * Mock relationship response.
 *
 * @export
 * @class MockRelationshipResponse
 */
export default class MockRelationshipResponse {
  /**
   * Creates an instance of MockRelationshipResponse.
   *
   * @param {Object} arguments - Arguments used to determine what type of mock eligibility response object to create.
   * @param {String} [arguments.hasAvailability] - Flag to determine if facility can service request. Default: true
   * @param {String} [arguments.typeOfCareId=primaryCare] - Type of care id. Default: 'primaryCare'
   * @memberof MockRelationshipResponse
   */
  constructor({
    id = '1',
    hasAvailability = true,
    typeOfCareId = TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
  } = {}) {
    const typeOfCare = getTypeOfCareById(typeOfCareId);

    this.id = id.toString();
    this.type = 'MockRelationshipResponse';
    this.attributes = {
      provider: {
        cernerId: 'Practitioner/123456',
        name: 'Doe, John D, MD',
      },
      location: {
        vhaFacilityId: '534',
        name: 'Zanesville Primary Care',
      },
      serviceType: {
        coding: [
          {
            system:
              'http://veteran.apps.va.gov/terminologies/fhir/CodeSystem/vats-service-type',
            code: typeOfCare.idV2,
            display: typeOfCare.name,
          },
        ],
        text: typeOfCare.name,
      },
      lastSeen: '2024-11-26T00:32:34.216Z',
      hasAvailability,
    };
  }
}
