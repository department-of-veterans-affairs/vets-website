/**
 * @module services/HealthcareService/transformers
 */

/**
 * Transforms
 * /vaos/v0/facilities/{facilityId}/clinics
 * to
 * /HealthcareService
 *
 * @param {string} facilityId
 * @param {VARClinic} clinic Clinic object to transform to HealthcareService object
 *
 * @returns {HealthCareService} A FHealthCareService resource
 */
export function transformAvailableClinic(facilityId, typeOfCareId, clinic) {
  return {
    // ID: VA facility site code and clinic id
    id: `${clinic.siteCode}_${clinic.clinicId}`,
    // ID of physical VA Facility (sta6id) where the clinic is located
    stationId: facilityId,
    // Name of VA facility where clinic is located
    stationName: clinic.institutionName,
    // Description of service as presented to a consumer while searching
    serviceName: clinic.clinicFriendlyLocationName || clinic.clinicName,
    // String value for patient direct scheduling  Y/N
    patientDirectScheduling: clinic.directSchedulingFlag,
  };
}

/**
 * Transforms
 * /vaos/v0/facilities/{facilityId}/clinics
 * to
 * /HealthcareService
 *
 * @param {string} facilityId
 * @param {Array<VARClinic>} clinics Array of clinic objects to transform to HealthcareService objects
 *
 * @returns {Array<HealthCareService>} An array of FHIR HealthcareService objects
 */
export function transformAvailableClinics(facilityId, typeOfCareId, clinics) {
  return clinics.map(clinic =>
    transformAvailableClinic(facilityId, typeOfCareId, clinic),
  );
}
