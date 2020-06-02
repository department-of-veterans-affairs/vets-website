const CodeableConcept = {
  // Code defined by a terminology system
  coding: {
    // The identification of the code system that defines the meaning of the symbol in the code.
    system: '',
    // The version of the code system which was used when choosing this code.
    version: '',
    // A symbol in syntax defined by the system.
    code: '',
    // A representation of the meaning of the code in the system, following the rules of the system.
    display: '',
    userSelected: false,
  },
  // Plain text representation of the concept
  text: '',
};

function mapSecondaryStopCode(clinic) {
  if (clinic.secondaryStopCode) {
    const obj = {
      ...CodeableConcept,
    };
    obj.coding.code = clinic.secondaryStopCode;

    return [obj];
  }

  return [];
}

/**
 *
 */
export function transformAvailableClinic(facilityId, clinic) {
  return {
    id: `var${facilityId}_${clinic.clinicId}`,
    resourceType: 'HealthcareService',
    // External identifiers for this item
    identifier: [
      {
        system: 'http://med.va.gov/fhir/urn',
        // TODO: get clinic id
        value: `urn:va:healthcareservice:${clinic.siteCode}:${facilityId}:${
          clinic.clinicId
        }`,
      },
    ],

    // Organization that provides this service
    // NOTE: Is this the location or the Organization????
    providedBy: 'Organization/39383',

    // Broad category of service being performed or delivered
    serviceCategory: { ...CodeableConcept },

    // Specific service delivered or performed
    serviceType: [
      {
        // Type of service delivered or performed.
        // NOTE: Use for primary stop code
        type: [
          {
            // Code defined by a terminology system
            coding: {
              // The identification of the code system that defines the meaning of the symbol in the code.
              system: '',
              // The version of the code system which was used when choosing this code.
              version: '',
              // A symbol in syntax defined by the system.
              code: clinic.primaryStopCode,
              // A representation of the meaning of the code in the system, following the rules of the system.
              display: '',
              userSelected: false,
            },
            // Plain text representation of the concept
            text: '',
          },
        ],
        // Specialties handled by the Service Site
        // NOTE: Use for secondary stop code if available
        specialty: mapSecondaryStopCode(clinic),
      },
    ],

    // Location where service may be provided
    location: {
      reference: `Location/3938336763`,
    },

    // Description of service as presented to a consumer while searching
    serviceName: clinic.clinicFriendlyLocationName
      ? clinic.clinicFriendlyLocationName
      : clinic.clinicName,

    // Additional description and/or any specific issues not covered elsewhere
    comment: '',

    // Extra details about the service that can't be placed in the other fields
    extraDetails: '',

    // Collection of characteristics (attributes)
    characteristic: [
      {
        // Code defined by a terminology system
        coding: {
          // The identification of the code system that defines the meaning of the symbol in the code.
          system: '',
          // The version of the code system which was used when choosing this code.
          version: '',
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
          // The identification of the code system that defines the meaning of the symbol in the code.
          system: '',
          // The version of the code system which was used when choosing this code.
          version: '',
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

    // Description of availability exceptions
    availabilityExceptions: '',
  };
}

/**
 *
 * @param {*} location
 * @param {*} clinics
 */
export function transformAvailableClinics(facilityId, clinics) {
  return clinics.map(clinic => transformAvailableClinic(facilityId, clinic));
}
