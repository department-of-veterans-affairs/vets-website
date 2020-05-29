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
export function transformAvailableClinic(facilityId, location, clinic) {
  const data = {
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

    // Facilitates quick identification of the service
    // N/A
    photo: {
      // Mime type of the content, with charset etc.
      contentType: 'code',
      // Human language of the content (BCP-47)
      language: 'code',
      // Data inline, base64ed
      data: 'base64Binary',
      // Uri where the data can be found
      url: 'uri',
      // Number of bytes of content (if url provided)
      size: 'unsignedInt',
      // Hash of the data (sha-1, base64ed)
      hash: 'base64Binary',
      // Label to display in place of the data
      title: 'string',
      // Date attachment was first created
      creation: 'dataTime',
    },

    // Contacts related to the healthcare service
    telecom: ['{ ContactPoint }'],

    // Location(s) service is inteded for/available to
    // N/A
    coverageArea: ['{ Reference(Location) }'],

    // Conditions under which service is available/offered
    // N/A
    serviceProvisionCode: [{ ...CodeableConcept }],

    // Specific eligibility requirements required to use the service
    // N/A
    eligibility: { ...CodeableConcept },

    // Describes the eligibility conditions for the service
    // N/A
    eligibilityNote: '<string>',

    // Program Names that categorize the service
    // N/A
    programName: ['<string>'],

    // Collection of characteristics (attributes)
    // TODO: Possible for other custom codes????
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

    // Ways that the service accepts referrals
    // N/A
    referralMethod: [{ ...CodeableConcept }],

    // PKI Public keys to support secure communications
    // N/A
    publicKey: '<string>',

    // If an appointment is required for access to this service
    appointmentRequired: true,

    // Times the Service Site is available
    availableTime: [
      {
        // mon | tue | wed | thu | fri | sat | sun
        daysOfWeek: location.hoursOfOperation.daysOfWeek,
        // Always available? e.g. 24 hour service
        allDay: location.hoursOfOperation.allDay,
        // Opening time of day (ignored if allDay = true)
        availableStartTime: location.hoursOfOperation.openingTime,
        // Closing time of day (ignored if allDay = true)
        availableEndTime: location.hoursOfOperation.closingTime,
      },
    ],

    // Not available during this time due to provided reason
    // N/A
    notAvailable: [
      {
        // Reason presented to the user explaining why time not available
        description: '',
        // Service not available from this date
        during: {
          start: 'dateTime',
          end: 'dateTime',
        },
      },
    ],

    // Description of availability exceptions
    availabilityExceptions: '',
  };

  return data;
}

/**
 *
 * @param {*} location
 * @param {*} clinics
 */
export function transformAvailableClinics(facilityId, location, clinics) {
  return clinics.map(clinic =>
    transformAvailableClinic(facilityId, location, clinic),
  );
}
