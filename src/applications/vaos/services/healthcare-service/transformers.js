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
    id: `${clinic.siteCode}_${clinic.clinicId}`,
    stationId: facilityId,
    stationName: clinic.institutionName,
    // Description of service as presented to a consumer while searching
    serviceName: clinic.clinicFriendlyLocationName || clinic.clinicName,
    // Collection of characteristics (attributes)
    // NOTE: The following pattern is used to populate this section (code & display are mutally exclusive):
    // 1. The 'text' attribute is used as the name of the code.
    // 2. The 'code' attribute is used if the attribute is (or looks like a code)
    // else it's undefined
    // 2. The 'display' attribute is used to hold the actual value of the code.
    characteristic: [
      // NOTE: KEVIN flatten this object and use individual properties for directSchedulingFlag, displayToPatientFlag, etc
      {
        // Code defined by a terminology system
        coding: {
          // A symbol in syntax defined by the system.
          code: undefined, // A representation of the meaning of the code in the system, following the rules of the system.
          display: clinic.directSchedulingFlag, // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        }, // Plain text representation of the concept
        text: 'directSchedulingFlag',
      },
      {
        // Code defined by a terminology system.
        coding: {
          // A symbol in syntax defined by the system.
          code: undefined, // A representation of the meaning of the code in the system, following the rules of the system.
          display: clinic.displayToPatientFlag, // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        }, // Plain text representation of the concept
        text: 'displayToPatientFlag',
      },
      {
        // Code defined by a terminology system
        coding: {
          // A symbol in syntax defined by the system.
          code: clinic.institutionCode, // A representation of the meaning of the code in the system, following the rules of the system.
          display: undefined, // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        }, // Plain text representation of the concept
        text: 'institutionCode',
      },
      {
        // Code defined by a terminology system
        coding: {
          // A symbol in syntax defined by the system.
          code: undefined, // A representation of the meaning of the code in the system, following the rules of the system.
          display: clinic.institutionName, // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        }, // Plain text representation of the concept
        text: 'institutionName',
      },
      {
        // Code defined by a terminology system
        coding: {
          // A symbol in syntax defined by the system.
          // code: undefined,
          // A representation of the meaning of the code in the system, following the rules of the system.
          display: clinic.clinicFriendlyLocationName,
          userSelected: false,
        }, // Plain text representation of the concept
        text: 'clinicFriendlyLocationName',
      },
    ],
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
