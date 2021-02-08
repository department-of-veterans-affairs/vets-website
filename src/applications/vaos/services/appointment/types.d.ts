type TypeOfCareId = 'CR1' | '323';

type LocationReference = `Location/${string}`; 
type OrganizationReference = `Organization/${string}`; 
type HealthcareServiceReference = `HealthcareServiceReference/${string}`; 
type PractitionerReference = `PractitionerReference/${string}`; 
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

type VideoVisitType =
  | 'ADHOC'
  | 'MOBILE_GFE'
  | 'CLINIC_BASED'
  | 'STORE_FORWARD'
  | 'MOBILE_ANY';
type VideoVisitCoding = {
  coding: [
    {
      system: 'VVS';
      code: VideoVisitType;
    }
  ];
};
type ATLASCode = {
  coding: [
    {
      system: 'ATLAS_CC';
      code: string;
    }
  ];
};

type VideoVisitResource = {
  resourceType: 'HealthcareService';
  id: string;
  type: [
    {
      text: 'Patient Virtual Meeting Room';
    }
  ];
  providedBy: {
    reference: OrganizationReference;
  };
  location?: {
    reference: LocationReference; 
  };
  telecom: [
    {
      system: 'url';
      value: string;
      period: {
        start: string;
      };
    }
  ];
  characteristic: [VideoVisitCoding, ATLASCode | undefined];
};

export type Appointment = {
  resourceType: 'Appointment';
  // Mapped from the mobile appointment service id or the var-resources request id
  id: string;
  // Mapped from createdDate field on requests, timezone is unclear
  created?: string;
  // Mapped from appointmentRequestDetailCode, only for requests
  cancelationReason?: {
    // veteranMessage field mapped only for requests, used for Express Care only
    text: string;
  };
  // Mapped from vdsAppointment.currentStatus or vvsAppointment.status.code for appoinments
  // Mapped from status for requests
  status: 
    // Used for all community care appointments and any non-cancelled VistA appointments
    'booked' |
    // Mapped from cancelled for requests, or the set of cancelled statuses for appointments
    'cancelled' | 
    // Mapped from the Submitted status for requests
    'proposed' |
    // Mapped from the Escalated status on Express Care requests 
    'pending' |
    // Mapped from the Resolved status for Express Care requests
    'fulfilled' |
    // Unused
    'arrived' |
    // Unused
    'noshow';
  // Mapped from vdsAppointment.currentStatus or vvsAppointment.status.code for appoinments
  // Null for other types of appointments/requests
  description?: string;
  // Only mapped for requests, undefined for appointments 
  type?: {
    coding: [
      {
        // Mapped from appt.typeOfCareId
        code: TypeOfCareId;
        // Mapped from appt.appointmentType
        display: string;
      }
    ];
  }
  // Mapped from appointmentTime for CC appointments, vvsAppointments.dateTime for video appointments,
  // startDate for VistA appointments, and date for Express Care requests
  start?: string;
  // Mapped from vdsAppointments.appointmentLength for VistA appointments or vvsAppointments.duration
  // for video appointments. Defaulted to 60 minutes if missing or a request.
  minutesDuration: number;
  // Mapped from instructionsToVeteran for community care appointments
  // Mapped from vdsAppointments.bookingNotes for VistA appointments
  // Mapped from vvsAppointments.instructionsTitle for video appointments,
  // Mapped from additionalInformation for requests, but that only has content for Express Care requests
  comment?: string;
  // Mapped from reasonForVisit for Express Care requests
  // Mapped from purposeForVisit for regular requests
  // Empty for other appointment types
  reason?: string;
  // Array of resources participating in this appointment, used to store information like clinic and location
  participant: Array<
    // Mapped from VistA clinic information for appointments
    ClinicPartipant |
    // Mapped from VA facility id and name info in appointments or requests 
    VALocationPartipant|
    // Mapped from vvsAppointments.providers for video appointments
    VideoPractitionerParticipant |
    // Mapped from community care provider info for community care appointments
    CommunityCarePractitionerParticipant
  >;
  // Fully defined resources specific to this appointment, currently just used for video information
  contained: Array<VideoVisitResource>;
  legacyVAR: {
    // This is the full appointment/request object. Generally, we shouldn't be pulling data from here
    apiData: Object;
    // Mapped from bestTimetoCall for requests
    bestTimeToCall: Array<string>;
  };
  // Mapped from optionDate and optionTime fields 1 through 3
  requestedPeriods?: Array<{
    // These dates will either have a midnight to Noon start and end time, or a Noon to midnight timeframe,
    // dependening on if the user chose AM or PM
    start: string;
    end: string;
  }>;
  // This object should contain derived data or information we need that doesn't fit in the FHIR format
  vaos: {
    appointmentType: 
      // Chosen for any item that has a typeOfCareId starting with CC 
      'ccRequest' |
      // Chosen for any item with an appointmentTime field or a communityCare flag set to true 
      'ccAppointment' | 
      // Chosen for any item with a typeOfCareId field that doesn't start with CC
      'request' |
      // Chosen for any item with a vvsAppointments array or a clinicId and a falsy communityCare flag
      'vaAppointment';
    // Set to true if appointmentType above is either ccRequest or ccAppointment
    isCommunityCare: boolean;
    // Set to true if the appointment is in the past, undefined for requests
    isPastAppointment?: boolean;
    // Mapped to timeZone for community care requests, null or undefined otherwise
    timeZone?: string;
    // Mapped from phoneOnly field for VistA appointments, undefined otherwise
    isPhoneAppointment?: boolean;
    // Set to true if typeOfCareId is CR1
    isExpressCare?: boolean;
  };
};
