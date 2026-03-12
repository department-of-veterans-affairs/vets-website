import {
  TYPES_OF_EYE_CARE,
  TYPES_OF_SLEEP_CARE,
  AUDIOLOGY_TYPES_OF_CARE,
  TYPES_OF_MENTAL_HEALTH,
  TYPES_OF_CARE,
} from '../../utils/constants';

/**
 * Mock service configuration.
 *
 * @export
 * @class MockServiceConfiguration
 */

export default class MockServiceConfiguration {
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
   * @param {?boolean} props.bookedAppointments - VPG flag to determine if booked appointments are supported. Default = false,
   * @param {?boolean} props.apptRequests - VPG flag to determine if appointment requests are supported. Default = false,
   * @memberof MockServiceConfiguration
   */
  constructor({
    canCancel = false,
    directEnabled = false,
    typeOfCareId,
    patientHistoryDuration = 365,
    patientHistoryRequired = false,
    requestEnabled = false,
    submittedRequestLimit = 0,
    bookedAppointments = false,
    apptRequests = false,
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

    // VPG format fields
    this.bookedAppointments = bookedAppointments;
    this.apptRequests = apptRequests;
  }
}
