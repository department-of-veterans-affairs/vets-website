/**
 * Mock VPG service configuration for vaServices array.
 *
 * @export
 * @class MockServiceConfigurationVA
 */

export default class MockServiceConfigurationVA {
  /**
   * Creates an instance of MockServiceConfigurationVA.
   *
   * @param {Object} props - Properties used to determine what type of mock VPG service configuration to create.
   * @param {String} props.clinicalServiceId - Clinical service ID (e.g., 'covid', 'primaryCare').
   * @param {?boolean} props.bookedAppointments - VPG flag to determine if booked appointments are supported. Default = false,
   * @param {?boolean} props.apptRequests - VPG flag to determine if appointment requests are supported. Default = false,
   * @memberof MockServiceConfigurationVA
   */
  constructor({
    clinicalServiceId,
    bookedAppointments = false,
    apptRequests = false,
  } = {}) {
    this.clinicalServiceId = clinicalServiceId;
    this.bookedAppointments = bookedAppointments;
    this.apptRequests = apptRequests;
  }
}
