export default class MockRelationshipResponse {
  constructor({ id = '1', hasAvailability = true }) {
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
            code: 'foodAndNutrition',
            display: 'Food and Nutrition',
          },
        ],
        text: 'Food and Nutrition',
      },
      lastSeen: '2024-11-26T00:32:34.216Z',
      hasAvailability,
    };
  }

  static createResponses({ count = 1, hasAvailability } = {}) {
    return Array(count)
      .fill(count)
      .map((_, index) => {
        return new MockRelationshipResponse({ id: index + 1, hasAvailability });
      });
  }
}
