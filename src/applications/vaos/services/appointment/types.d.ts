type TypeOfCareId = 'CR1' | '323';

type PractitionerReference = 'PractitionerReference/${string}';
type ClinicPartipant = {
  actor: {
    reference: HealthcareServiceReference;
    display: string;
  };
};

type VALocationPartipant = {
  actor: {
    reference: LocationReference;
  };
};
type VideoPractitionerParticipant = {
  actor: {
    reference: PractitionerReference;
  };
};
type CommunityCarePractitionerParticipant = {
  actor: {
    reference: 'Practitioner/PRACTITIONER_ID';
    display: string;
  };
};

type VistaAppointmentParticipants = [
  {
    // Equivalent to a VistA clinic resource
    actor: {
      // Mapped to HealthcareService/var${appointment.facilityId}_${appointment.clinicId}
      // Clinics are uniquely identified by a combination of the VistA site/instance id
      // and the clinic id
      reference: 'HealthcareServiceReference/${string}';
      // Mapped from appointment.clinicFriendlyName or appointment.vdsAppointments[0].clinic.name
      display: string;
    };
  },
  {
    // Equivalent to a VA facility record
    actor: {
      // Mapped to Location/var${appointment.sta6aid}
      // It is intentionally not mapped to appointment.facilityId, because that is the VistA
      // site/instance id.
      reference: 'Location/${string}';
    };
  }
];

type VARequestParticipants = [
  {
    // Equivalent to a VA facility record
    actor: {
      // Mapped to Location/var${request.facility.facilityCode}
      reference: 'Location/${string}';
    };
  }
];

type CommunityCareRequestParticipants = Array<
  // Should only be one Partient resource in this array
  | {
      resourceType: 'Patient';
      name: {
        // Mapped from request.patient.displayName or request.patient.firstName request.patient.lastName
        text?: string;
      };
      telecom: [
        {
          system: 'phone';
          // Mapped from request.phoneNumber
          value: string;
        },
        {
          system: 'email';
          // Mapped from request.email
          value: string;
        }
      ];
    }
  // Each preferred providers will have a Practioner resource in here, currently will just be one provider
  | {
      resourceType: 'Practitioner';
      // Mapped to cc-practitioner-${request.id}-${request.ccAppointmentRequest.preferredProviders.index}
      id: 'cc-practitioner-${string}-${string}';
      // Exists if request.ccAppointmentRequest.preferredProviders[].lastName is present
      name?: {
        // Mapped to request.ccAppointmentRequest.preferredProviders[].firstName
        // and request.ccAppointmentRequest.preferredProviders[].lastName
        text: string;
        // Mapped to request.ccAppointmentRequest.preferredProviders[].lastName
        family: string;
        // Mapped to request.ccAppointmentRequest.preferredProviders[].firstName
        given: string;
      };
      address?: {};
      practitionerRole: [
        {
          location: [
            {
              // Mapped to Location/cc-location-${request.id}-${request.ccAppointmentRequest.preferredProviders.index}
              reference: 'Location/cc-location-${string}-${string}';
              // Mapped to request.ccAppointmentRequest.preferredProviders[].practiceName
              display: string;
            }
          ];
        }
      ];
    }
>;

type VideoContainedResources = [
  {
    resourceType: 'HealthcareService';
    // Mapped from appointment.vvsAppointments[0].id
    id: string;
    type: [
      {
        text: 'Patient Virtual Meeting Room';
      }
    ];
    providedBy: {
      // Mapped to Organization/var${appointment.facilityId}
      reference: 'Organization/${string}';
    };
    // Only exists if appointment.sta6aid exists and appointment.vvsAppointments[0].tasInfo does not
    location?: {
      // Mapped to Location/var${appointment.sta6aid}
      // Not sure this is every different from the facility used in providedBy above
      reference: 'Location/${string}';
    };
    telecom: [
      {
        system: 'url';
        // Mapped from appointment.vvsAppointments[0].patients[0].virtualMeetingRoom.url
        value: string;
        period: {
          // Mapped from appointment.vvsAppointments[0].dateTime
          start: string;
        };
      }
    ];
    characteristic: [
      {
        coding: [
          {
            system: 'VVS';
            // Mapped from appointment.vvsAppointments[0].appointmentKind
            code:
              | 'ADHOC'
              | 'MOBILE_GFE'
              | 'CLINIC_BASED'
              | 'STORE_FORWARD'
              | 'MOBILE_ANY';
          }
        ];
      },

      // Set if appointment.vvsAppointments[0].tasInfo exists


        | {
            coding: [
              {
                system: 'ATLAS_CC';
                // Mapped from appointment.vvsAppointments[0].tasInfo.confirmationCode
                code: string;
              }
            ];
          }
        | undefined
    ];
  },

  // This exists if the tasInfo object exists for a video appointment, marking
  // it as an ATLAS appointment


    | {
        resourceType: 'Location';
        // Mapped from appointments.vvsAppointments[0].tasInfo.siteCode
        id: string;
        address: {
          // Mapped from appointments.vvsAppointments[0].tasInfo.address.streetAddress
          line: [string];
          // Mapped from appointments.vvsAppointments[0].tasInfo.address.city
          city: string;
          // Mapped from appointments.vvsAppointments[0].tasInfo.address.state
          state: string;
          // Mapped from appointments.vvsAppointments[0].tasInfo.address.zipCode
          postalCode: string;
        };
        position: {
          // Mapped from appointments.vvsAppointments[0].tasInfo.address.longitude
          longitude: float;
          // Mapped from appointments.vvsAppointments[0].tasInfo.address.latitude
          latitude: float;
        };
      }
    | undefined
];

/* 
 * Appointments resources are created from several different data sources:
 * - VistA and Video appointments from mobile appointment service (MAS)
 * - Community care appointments fetched from var-resources service
 * - VA and CC requests stored fetched from var-resources service
 * 
 * Records from each of those sources are called appointments, ccAppointments,
 * and requests, respectively
 */
export type Appointment = {
  resourceType: 'Appointment';
  // Mapped from appointment.id, request.id, or ccAppointment.id
  id: string;
  // Mapped from request.createdDate, timezone is unclear
  created?: string;
  // Mapped from request.appointmentRequestDetailCode, only for requests
  cancelationReason?: {
    // veteranMessage field mapped only for requests, used for Express Care only
    text: string;
  };
  // Mapped from appointment.vdsAppointments[0].currentStatus or
  // appointment.vvsAppointments[0].status.code for appoinments
  // Mapped from request.status for requests
  status:  // Used for all community care appointments and any non-cancelled VistA appointments
    | 'booked'
    // Mapped from cancelled for requests, or the set of cancelled statuses for appointments
    | 'cancelled'
    // Mapped from the Submitted status for requests
    | 'proposed'
    // Mapped from the Escalated status on Express Care requests
    | 'pending'
    // Mapped from the Resolved status for Express Care requests
    | 'fulfilled'
    // Unused
    | 'arrived'
    // Unused
    | 'noshow';
  // Mapped from appointment.vdsAppointments[0].currentStatus or appointment.vvsAppointments[0].status.code for appoinments
  // Null for other types of appointments/requests
  description?: string;
  // Only mapped for requests, undefined for appointments
  type?: {
    coding: [
      {
        // Mapped from request.typeOfCareId
        code: TypeOfCareId;
        // Mapped from request.appointmentType
        display: string;
      }
    ];
  };
  // Mapped from ccAppointment.appointmentTime for CC appointments, appointment.vvsAppointments[0].dateTime for video appointments,
  // appointment.startDate for VistA appointments, and request.date for Express Care requests
  start?: string;
  // Mapped from appointment.vdsAppointments[0].appointmentLength for VistA appointments or appointment.vvsAppointments[0].duration
  // for video appointments. Defaulted to 60 minutes if missing or a request.
  minutesDuration: number;
  // Mapped from ccAppointment.instructionsToVeteran for community care appointments
  // Mapped from appointment.vdsAppointments[0].bookingNotes for VistA appointments
  // Mapped from appointment.vvsAppointments[0].instructionsTitle for video appointments,
  // Mapped from request.additionalInformation, but that only has content for Express Care requests
  comment?: string;
  // Mapped from request.reasonForVisit for Express Care requests
  // Mapped from request.purposeForVisit for regular requests
  // Empty for other appointment types
  reason?: string;
  // Array of resources participating in this appointment, used to store information like clinic and location
  participant:
    | VistaAppointmentParticipants
    | VARequestParticipants
    | VideoParticipants
    | CommunityCareParticipants
    // Empty array for community care requests
    | [];
  // Fully defined resources specific to this appointment, currently just used for video information
  contained:
    | VideoContainedResources
    | VARequestContainedResources
    | CommunityCareRequestContainedResources
    | CommunityCareContainedResources
    // Empty array for VistA appointments
    | [];
  legacyVAR: {
    // This is the full appointment/request object. Generally, we shouldn't be pulling data from here
    apiData: Object;
    // Mapped from request.bestTimetoCall
    bestTimeToCall: Array<string>;
  };
  // Mapped from request.optionDate and request.optionTime fields 1 through 3
  requestedPeriods?: Array<{
    // These dates will either have a midnight to Noon start and end time, or a Noon to midnight timeframe,
    // dependening on if the user chose AM or PM
    start: string;
    end: string;
  }>;
  // This object should contain derived data or information we need that doesn't fit in the FHIR format
  vaos: {
    appointmentType:  // Chosen for any item that has a request.typeOfCareId starting with CC
      | 'ccRequest'
      // Chosen for any item with an ccAppointment.appointmentTime field or a communityCare flag set to true
      | 'ccAppointment'
      // Chosen for any item with a request.typeOfCareId field that doesn't start with CC
      | 'request'
      // Chosen for any item with an appointment.vvsAppointments[0] array or a clinicId and a falsy
      // appointment.communityCare flag
      | 'vaAppointment';
    // Set to true if request.appointmentType above is either ccRequest or ccAppointment
    isCommunityCare: boolean;
    // Set to true if the appointment is in the past, undefined for requests
    isPastAppointment?: boolean;
    // Mapped to request.timeZone for community care requests, null or undefined otherwise
    timeZone?: string;
    // Mapped from appointment.phoneOnly field for VistA appointments, undefined otherwise
    isPhoneAppointment?: boolean;
    // Set to true if request.typeOfCareId is CR1
    isExpressCare?: boolean;
  };
};
