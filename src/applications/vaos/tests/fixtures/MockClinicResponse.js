/* eslint-disable no-plusplus */

/**
 * Mock clinic response.
 *
 * @export
 * @class MockClinicResponse
 */
export default class MockClinicResponse {
  /**
   * Creates an instance of MockClinicResponse.
   *
   * @param {Object} props - Properties used to determine what type of mock response to create.
   * @param {string} props.id Clinic id.
   * @param {string} [props.name] Clinic name. Clinic name will default to 'Clinic 1' if not specified,
   * @param {string} [props.locationId] Location id. Default '983'
   * @memberof MockClinicResponse
   */
  constructor({ id, name = null, locationId = '983' }) {
    this.id = id.toString();
    this.type = 'MockClinic';
    this.attributes = {
      char4: null,
      id: this.id,
      patientDirectScheduling: true,
      patientDisplay: null,
      phoneNumber: null,
      physicalLocation: null,
      primaryStopCode: null,
      primaryStopCodeName: null,
      secondaryStopCode: null,
      secondaryStopCodeName: null,
      serviceName: name || `Clinic ${id}`,
      stationId: locationId,
      stationName: null,
      vistaSite: locationId?.substr(0, 3),
    };
  }

  /**
   * @typedef {Object} Clinic
   * @property {string} id - Clinic id
   * @property {string} name - Clinic name
   * @property {string} locationId - Location id.
   */

  /**
   * Method to create multiple mock responses. The clinic id will start at 1 and
   * increment by 1 for each mock clinic created.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {number} [arguments.count=1] - Number of responses to create. Default 1.
   * @param {string} [arguments.locationId='983'] - Facility location id.  Default '983'
   * @param {Array<Clinic>} [arguments.clinics] - Array of clinic objects. If specified, the number of clinics is used to determine the number of responses to create.
   *
   * @returns Array of MockClinicResponse.
   * @memberof MockClinicResponse
   */
  static createResponses({ count = 1, locationId = '983', clinics } = {}) {
    const array = [];

    let name = '';
    let cnt = count;

    // If clinic array defined, use it to determine the number of mock responses
    // to create.
    if (clinics?.length) cnt = clinics.length;

    for (let index = 0; index < cnt; index++) {
      if (Array.isArray(clinics)) name = clinics[index].name;
      else name = `Clinic ${index + 1}`;

      array.push(
        new MockClinicResponse({
          id:
            clinics?.length === cnt && clinics[index].id
              ? clinics[index].id
              : index + 1,
          locationId,
          name,
        }),
      );
    }

    return array;
  }
}
