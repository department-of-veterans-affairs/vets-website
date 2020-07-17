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
    id: `var${clinic.siteCode}_${clinic.clinicId}`,
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
    // NOTE: The following pattern is used to populate this section (code & display are mutally exclusive):
    // 1. The 'text' attribute is used as the name of the code.
    // 2. The 'code' attribute is used if the attribute is (or looks like a code)
    // else it's undefined
    // 2. The 'display' attribute is used to hold the actual value of the code.
    characteristic: [
      {
        // Code defined by a terminology system
        coding: {
          // A symbol in syntax defined by the system.
          code: undefined,
          // A representation of the meaning of the code in the system, following the rules of the system.
          display: clinic.directSchedulingFlag,
          // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        },
        // Plain text representation of the concept
        text: 'directSchedulingFlag',
      },
      {
        // Code defined by a terminology system.
        coding: {
          // A symbol in syntax defined by the system.
          code: undefined,
          // A representation of the meaning of the code in the system, following the rules of the system.
          display: clinic.displayToPatientFlag,
          // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        },
        // Plain text representation of the concept
        text: 'displayToPatientFlag',
      },
      {
        // Code defined by a terminology system
        coding: {
          // A symbol in syntax defined by the system.
          code: clinic.institutionCode,
          // A representation of the meaning of the code in the system, following the rules of the system.
          display: undefined,
          // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        },
        // Plain text representation of the concept
        text: 'institutionCode',
      },
      {
        // Code defined by a terminology system
        coding: {
          // A symbol in syntax defined by the system.
          code: undefined,
          // A representation of the meaning of the code in the system, following the rules of the system.
          display: clinic.institutionName,
          // NOTE: Would love to use this field since it's type is boolean
          userSelected: false,
        },
        // Plain text representation of the concept
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
        },
        // Plain text representation of the concept
        text: 'clinicFriendlyLocationName',
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

/**
 * Method to find a particular characteristic of a clinic.
 *
 * @param {Object} clinic
 * @param {String} characteristic The characteristic to search for.
 *
 * @returns {String} The display name of the characteristic search for or an empty string.
 */
export function findCharacteristic(clinic, characteristic) {
  const result = clinic?.characteristic.find(element => {
    return element.text === characteristic;
  });

  return result.coding.code && result.coding.code !== undefined
    ? result.coding.code
    : result.coding.display;
}
