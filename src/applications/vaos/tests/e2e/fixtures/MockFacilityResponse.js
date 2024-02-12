/* eslint-disable no-plusplus */
export default class MockFacilityResponse {
  constructor({ id = '983', name = 'Cheyenne VA Medical Center' } = {}) {
    this.id = id;
    this.type = 'facility';
    this.attributes = {
      id: this.id,
      name,
      phone: {
        main: '1234567890',
      },
      physicalAddress: {
        type: 'physical',
        line: ['2360 East Pershing Boulevard', null, 'Suite 10'],
        city: `City ${id}`,
        state: 'WY',
        postalCode: '82001-5356',
      },
      vastParent: id,
    };
  }

  /**
   * Method to generate multiple responses.
   *
   * NOTE: When using this method, the facility name will be generated as 'Facility <id>'.
   *
   * @static
   * @param {Object} arguments
   * @param {Array.<String>} [arguments.facilityIds=[]] - Array of facility ids.
   * @returns Array of MockFacility.
   * @memberof MockFacility
   */
  static createResponses({ facilityIds = [] } = {}) {
    return facilityIds.map(id => {
      return new MockFacilityResponse({ id, name: `Facility ${id}` });
    });
  }
}
