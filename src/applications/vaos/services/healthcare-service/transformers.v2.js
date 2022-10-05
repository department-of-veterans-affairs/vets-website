/**
 * @module services/HealthcareService/transformers
 */

/**
 * Transforms a clinic from the VAOS service into our HealthCareService format
 *
 * @param {VAOSClinic} clinic Clinic object to transform to HealthcareService object
 *
 * @returns {HealthCareService} A HealthCareService resource
 */
export function transformClinicV2(clinic) {
  return {
    // ID: VA facility site code and clinic id
    id: `${clinic.vistaSite}_${clinic.id}`,
    // ID of physical VA Facility (sta6id) where the clinic is located
    stationId: clinic.stationId,
    // Name of VA facility where clinic is located
    stationName: clinic.stationName,
    // Description of service as presented to a consumer while searching
    serviceName: clinic.serviceName,
    // Boolean to allow direct scheduling by patient
    patientDirectScheduling: clinic.patientDirectScheduling,
  };
}

/**
 * Transforms a list of clinics from the VAOS service into our HealthCareService format
 *
 * @param {Array<VAOSClinic>} clinics Array of clinic objects to transform to HealthcareService objects
 *
 * @returns {Array<HealthCareService>} An array of FHIR HealthcareService objects
 */
export function transformClinicsV2(clinics) {
  return clinics.map(clinic => transformClinicV2(clinic));
}
