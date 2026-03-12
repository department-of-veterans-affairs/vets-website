/**
 * Mock scheduling configuration response.
 *
 * @export
 * @class MockSchedulingConfigurationResponse
 */
export default class MockSchedulingConfigurationResponse {
  /**
   * Creates an instance of MockSchedulingConfigurationResponse.
   *
   * @param {Object} props - Properties used to determine what type of mock service configuration to create.
   * @param {?boolean} [props.communityCare=false] -  Flag to determine if facility supports CC scheduling.
   * @param {String} props.facilityId - Facility id.
   * @param {?Array<MockServiceConfiguration>} props.services- Array of mock service configuration objects.
   * @param {?Array<MockServiceConfigurationVA>} props.vaServices - Array of mock VPG service configuration objects.
   * @memberof MockSchedulingConfigurationResponse
   */
  constructor({
    communityCare = false,
    facilityId,
    services = [],
    vaServices = [],
  } = {}) {
    this.id = facilityId;
    this.type = 'MockSchedulingConfigurationResponse';

    this.attributes = {
      facilityId: this.id,
      services,
      vaServices,
      ccServices: [],
      communityCare,
    };
  }

  setService(service) {
    this.attributes.services.push(service);
    this.attributes.vaServices.push(service);
    return this;
  }

  setVaService(vaService) {
    this.attributes.vaServices.push(vaService);
    return this;
  }
}
