/**
 * @summary
 * Patient Provider Relationship
 *
 * @typedef {Object} PatientProviderRelationship
 * @global
 *
 * @property {'PatientProviderRelationship'} resourceType Static resource type string
 * @property {String} providerName The full name of the provider
 * @property {String} providerId The Cerner id for the provider
 * @property {String} serviceType The service type code
 * @property {String} loctionName The VA facility name
 * @property {String} clinicName The clinic name
 * @property {String} vistaId The three digit VistA id
 * @property {string} lastSeen Date in ISO format of the when the patient was last seen by this provider
 */

/**
 * @typedef PatientEligibilityForType
 * @global
 *
 * @property {boolean} hasRequiredAppointmentHistory Has had appointment in the past that meets VATS requirements
 *   - Mapped from past visits check
 * @property {?boolean} isEligibleForNewAppointmentRequest Is under the request limit
 *   - Mapped from request limits check
 */

/**
 * @typedef PatientEligibility
 * @global
 *
 * @property {?PatientEligibilityForType} direct Patient eligibility for direct scheduling
 * @property {?PatientEligibilityForType} request Patient eligibility for requests
 */

/**
 * @typedef {'error'|'overRequestLimit'|'noEnabled'|'notSupported'|'noRecentVisit'|
 *   'noClinics'|'noMatchingClinics'} EligibilityReason
 * @global
 */

/**
 * @typedef FlowEligibility
 * @global
 *
 * @property {boolean} direct Can the patient use the direct schedule flow
 * @property {Array<EligibilityReason>} directReason The reason the patient isn't eligible for direct flow
 * @property {boolean} request Can the patient use the request flow
 * @property {Array<EligibilityReason>} requestReason The reason the patient isn't eligible for request flow
 */

/**
 * @typedef FlowEligibilityReturnData
 * @global
 *
 * @property {FlowEligibility} eligibility The eligibility info for the patient
 * @property {Array<HealthCareService>} clinics An array of clinics pulled when checking eligibility
 * @property {Array<MASAppointment>} pastAppointments An array of untransformed appointments pulled
 *   when checking eligibility
 */
