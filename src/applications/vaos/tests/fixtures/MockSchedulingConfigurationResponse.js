/* eslint-disable max-classes-per-file */

import {
  AUDIOLOGY_TYPES_OF_CARE,
  TYPES_OF_CARE,
  TYPES_OF_EYE_CARE,
  TYPES_OF_SLEEP_CARE,
  TYPES_OF_MENTAL_HEALTH,
} from '../../utils/constants';

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
   * @memberof MockSchedulingConfigurationResponse
   */
  constructor({ communityCare = false, facilityId, services = [] } = {}) {
    this.id = facilityId;
    this.type = 'MockSchedulingConfigurationResponse';

    this.attributes = {
      facilityId: this.id,
      services,
      communityCare,
    };
  }

  setService(service) {
    this.attributes.services.push(service);
    return this;
  }
}

/**
 * Mock service configuration.
 *
 * @export
 * @class MockServiceConfiguration
 */
export class MockServiceConfiguration {
  /**
   * Creates an instance of MockServiceConfiguration.
   *
   * @param {Object} props - Properties used to determine what type of mock service configuration to create.
   * @param {?boolean} props.canCancel - Flag to determine if appointment cancelation is supported at facility. Default  = false,
   * @param {?boolean} props.directEnabled - Flag to determine if appointment direct scheduling is supported at facility. Default  = false,
   * @param {String} props.typeOfCareId - Type of care to configure appointment scheduling for.
   * @param {?number} props.patientHistoryDuration - How far in history to check for appointments if patient history is required. Default  = 365,
   * @param {?boolean} props.patientHistoryRequired - Flag to determine is appointment history should be checked when scheduling. Default  = true,
   * @param {?boolean} props.requestEnabled - Flag to determine is appointment request is support at facility. Default  = false,
   * @param {?number} props.submittedRequestLimit - Max number of appoinment requests allowed. Default = 0,
   * @memberof MockServiceConfiguration
   */
  constructor({
    canCancel = false,
    directEnabled = false,
    typeOfCareId,
    patientHistoryDuration = 365,
    patientHistoryRequired = true,
    requestEnabled = false,
    submittedRequestLimit = 0,
  } = {}) {
    this.id = typeOfCareId;

    const allTypesOfCare = [
      ...TYPES_OF_EYE_CARE,
      ...TYPES_OF_SLEEP_CARE,
      ...AUDIOLOGY_TYPES_OF_CARE,
      ...TYPES_OF_MENTAL_HEALTH,
      ...TYPES_OF_CARE,
    ];

    const typeOfCare = allTypesOfCare.find(type => {
      return type.idV2 === this.id;
    });
    this.name = typeOfCare?.name || 'Some type of care';

    this.stopCodes = [];
    this.direct = {
      patientHistoryRequired,
      patientHistoryDuration,
      canCancel,
      enabled: directEnabled,
    };
    this.request = {
      patientHistoryRequired,
      patientHistoryDuration,
      submittedRequestLimit,
      enterpriseSubmittedRequestLimit: 2,
      enabled: requestEnabled,
    };
  }
}
