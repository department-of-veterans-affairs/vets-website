/* eslint-disable no-plusplus */
export class MockFacility {
  constructor({ id = '983', name = 'Cheyenne VA Medical Center' } = {}) {
    this.id = id;
    this.type = 'facility';
    this.attributes = {
      id: this.id,
      name,
      physicalAddress: {
        type: 'physical',
        line: ['2360 East Pershing Boulevard', null, 'Suite 10'],
        city: 'Cheyenne',
        state: 'WY',
        postalCode: '82001-5356',
      },
    };
  }

  static createMockFacilities({ facilityIds = [] } = {}) {
    return facilityIds.map(id => {
      return new MockFacility({ id, name: `Facility ${id}` });
    });
  }
}
