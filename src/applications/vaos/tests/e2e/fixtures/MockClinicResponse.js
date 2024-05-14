/* eslint-disable no-plusplus */
export default class MockClinicResponse {
  constructor({ id, name = null, locationId = '983' }) {
    this.id = id.toString();
    this.type = 'MockClinic';
    this.attributes = {
      vistaSite: locationId,
      id: this.id,
      serviceName: name || `Clinic ${id}`,
      stationId: locationId,
      patientDirectScheduling: true,
    };
  }

  /**
   * Method to create multiple mock clinics. The clinic id will start at 1 and
   * increment by 1 for each mock clinic created.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {number} [count=1] - Number of clinics to create.
   * @param {string} [locationId='983'] - Facility location id.
   * @returns Array of MockClinicResponse.
   * @memberof MockClinicResponse
   */
  static createResponses({ count = 1, locationId = 983 } = {}) {
    const array = [];
    for (let index = 0; index < count; index++) {
      array.push(
        new MockClinicResponse({
          id: index + 1,
          locationId,
          name: `Clinic ${index + 1}`,
        }),
      );
    }
    return array;
  }
}
