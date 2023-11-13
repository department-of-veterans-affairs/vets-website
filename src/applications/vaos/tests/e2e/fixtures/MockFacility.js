export class MockFacility {
  constructor() {
    this.id = '983';
    this.type = 'facility';
    this.attributes = {
      id: this.id,
      name: 'Cheyenne VA Medical Center',
      physicalAddress: {
        type: 'physical',
        line: ['2360 East Pershing Boulevard', null, 'Suite 10'],
        city: 'Cheyenne',
        state: 'WY',
        postalCode: '82001-5356',
      },
    };
  }
}
