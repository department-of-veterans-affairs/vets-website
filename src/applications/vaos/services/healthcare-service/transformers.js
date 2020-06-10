/**
 * Transforms
 * /vaos/v0/facilities/{facilityId}/clinics
 * to
 * /HealthcareService
 *
 * @param {String} facilityId
 * @param {Object} clinic Clinic object to transform to HealthcareService object
 *
 * @returns {Object} A FHIR HealthcareService object
 */
export function transformAvailableClinic(facilityId, typeOfCareId, clinic) {
  return {
    id: `var${facilityId}_${clinic.clinicId}`,
    resourceType: 'HealthcareService',
    // External identifiers for this item
    identifier: [
      {
        system: 'http://med.va.gov/fhir/urn',
        value: `urn:va:healthcareservice:${clinic.siteCode}:${facilityId}:${
          clinic.clinicId
        }`,
      },
    ],

    // Organization that provides this service
    providedBy: `Organization/var${clinic.siteCode}`,

    // Specific service delivered or performed
    serviceType: [
      {
        // Type of service delivered or performed.
        type: {
          // Code defined by a terminology system
          coding: {
            // A symbol in syntax defined by the system.
            code: typeOfCareId,
            userSelected: false,
          },
        },
      },
    ],

    // Location where service may be provided
    location: {
      reference: `Location/var${facilityId}`,
    },

    // Description of service as presented to a consumer while searching
    serviceName: clinic.clinicFriendlyLocationName
      ? clinic.clinicFriendlyLocationName
      : clinic.clinicName,

    // Collection of characteristics (attributes)
    characteristic: [
      {
        // Code defined by a terminology system
        coding: {
          // A symbol in syntax defined by the system.
          code: clinic.directSchedulingFlag,
          // A representation of the meaning of the code in the system, following the rules of the system.
          display: 'directSchedulingFlag',
          // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        },
        // Plain text representation of the concept
        text: 'directSchedulingFlag',
      },
      {
        // Code defined by a terminology system
        coding: {
          // A symbol in syntax defined by the system.
          code: clinic.displayToPatientFlag,
          // A representation of the meaning of the code in the system, following the rules of the system.
          display: 'displayToPatientFlag',
          // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        },
        // Plain text representation of the concept
        text: 'displayToPatientFlag',
      },
    ],

    // If an appointment is required for access to this service
    appointmentRequired: true,
  };
}

/**
 * Transforms
 * /vaos/v0/facilities/{facilityId}/clinics
 * to
 * /HealthcareService
 *
 * @param {String} facilityId
 * @param {Array} clinics Array of clinic objects to transform to HealthcareService objects
 *
 * @returns {Array} An array of FHIR HealthcareService objects
 */
export function transformAvailableClinics(facilityId, typeOfCareId, clinics) {
  return clinics.map(clinic =>
    transformAvailableClinic(facilityId, typeOfCareId, clinic),
  );
}
