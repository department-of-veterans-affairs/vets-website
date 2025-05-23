/**
 *
 *
 * @export
 * @class MockFacility
 */
export default class MockFacility {
  /**
   * Creates an instance of MockFacility.
   * @param {Object} props
   * @param {?String} props.stationId - Station id. Default = '983'
   * @param {?String} props.clinicPhysicalLocation - Clinic physical location. Default = 'CHEYENNE'.
   * @memberof MockFacility
   */
  constructor({ stationId = '983', clinicPhysicalLocation = 'CHEYENNE' } = {}) {
    this.stationId = stationId;
    this.clinicName = 'Clinic 1';
    this.clinicPhysicalLocation = clinicPhysicalLocation;
    this.clinicPhone = '500-500-5000';
    this.clinicPhoneExtension = '1234';
  }
}
