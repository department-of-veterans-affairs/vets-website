/* eslint-disable no-plusplus */

/**
 * Mock facility response.
 *
 * @export
 * @class MockFacilityResponse
 */
export default class MockFacilityResponse {
  /**
   * Creates an instance of MockFacilityResponse.
   *
   * @param {Object} props - Properties used to determine what type of mock facility to create.
   * @param {string} [props.id=983] - Facility id. Default = 983.
   * @param {string} [props.name] - Name of the facility. Default = Cheyenne VA Medical Center
   *
   * @export
   * @class MockFacilityResponse
   */
  constructor({
    id = '983',
    isParent = false,
    name = 'Cheyenne VA Medical Center',
  } = {}) {
    this.id = id;
    this.type = 'facility';
    this.attributes = {
      id: this.id,
      name,
      lat: 0,
      long: 0,
      phone: {
        main: '307-778-7550',
      },
      physicalAddress: {
        type: 'physical',
        line: ['2360 East Pershing Boulevard', null, 'Suite 10'],
        city: `City ${id}`,
        state: 'WY',
        postalCode: '82001-5356',
      },
      vistaSite: id.substring(0, 3),
      vastParent: isParent ? id : id.substring(0, 3),
    };
  }

  /**
   * Method to generate multiple responses.
   *
   * NOTE: When using this method, the facility name will be generated as 'Facility :facilityId'.
   *
   * @static
   * @param {Object} arguments
   * @param {Array<String>} [arguments.facilityIds=[]] - Array of facility ids.
   *
   * @returns {Array<MockFacilityResponse>} Array of MockFacilityResponse.
   * @memberof MockFacilityResponse
   */
  static createResponses({ facilityIds = [] } = {}) {
    return facilityIds.map(id => {
      return new MockFacilityResponse({ id, name: `Facility ${id}` });
    });
  }

  setAddress(value) {
    this.attributes.physicalAddress = value;
    return this;
  }

  setLatitude(value) {
    this.attributes.lat = value;
    return this;
  }

  setLongitude(value) {
    this.attributes.long = value;
    return this;
  }

  setPhoneNumber(value) {
    this.attributes.phone.main = value;
    return this;
  }
}
