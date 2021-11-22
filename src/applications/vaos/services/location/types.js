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

/**
 * @typedef {Object} Position
 *
 * @property {Number} latitude
 * @property {Number} longitude
 */

/**
 * @typedef {Object} HoursOfOperation
 *
 * @property {Array<string>} daysOfWeek The days of the week where the facility is available for the given hours
 * @property {boolean} allDay Is the location open all day on the given days of the week
 * @property {?string} openingTime The opening time in HH:mm format
 * @property {?string} closingTime The closing time in HH:mm format
 */

/**
 * @typedef {Object} Location
 *
 * @property {string} id The full identifier of the location, usually a VA facility id, vets-api CCP id, or ATLAS site code
 * @property {?string} vistaId The three digit VistA id, if the Location is a VA location
 * @property {Array<Identifier>} identifier Contains identifiers for the PPMS provider, VA facility, others
 * @property {string} name The name of the location (either the PPMS provider/practice name or the VA facility name)
 * @property {Array<Telecom>} telecom Telecom array that contains the main phone number for a VA facility or PPMS provider.
 *   Also contains an entry for the covid vaccine phone number if available for a VA facility
 * @property {?Address} address The location's address
 * @property {?Position} position An object containing the latitude and longitude of the location
 * @property {?Array<HoursOfOperation>} hoursOfOperation The hours of operation for a VA facility
 * @property {?Object} managingOrganization The VistA site that manages this location, if it's a VA facility
 * @property {string} managingOrganization.reference The id of the VistA site, in Organization/{id} format
 * @property {?Object} legacyVAR Object containing extra VAOS information for VA locations used in the
 *   new appointment flow
 * @property {Object} legacyVAR.settings Settings object with keys that correspond to the id of the types of care
 *   and values that are {@link ClinicalServiceSetting} objects
 */
