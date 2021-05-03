/**
 * @typedef {Object} ClinicalServiceSetting
 *
 * @property {boolean} enabled Is this service enabled or not
 *   - Set to true if patientHistoryRequired exists in MFS v1 settings
 * @property {boolean} patientHistoryRequired Does this service require the patient to have been seen recently
 * @property {boolean} patientHistoryDuration Within how many months must the patienat have been seen (0 means disabled)
 * @property {?number} submittedRequestLimit Max number of requests allowed for this service (only exists for request settings)
 */

/**
 * @typedef {Object} ClinicalService
 *
 * @property {string} id Service (type of care) id
 * @property {string} name Name of clinic service
 *   - Mapped from typeOfCare in eligibility criteria
 * @property {ClinicalServiceSetting} direct Direct scheduling settings for the service
 * @property {ClinicalServiceSetting} request Request settings for the service
 */

/**
 * @typedef {Object} FacilitySettings
 *
 * @property {string} id Station id of facility (sta6aid)
 * @property {Array<ClinicalServiceSetting>} services List of clinical services potentially supported by the facility
 */
