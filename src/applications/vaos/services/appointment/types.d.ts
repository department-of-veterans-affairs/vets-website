type TypeOfCareId = 'CR1' | '323';

interface FHIRType {
  coding: [
    {
      code: TypeOfCareId;
      display: string;
    }
  ];
}
type LocationReference = `Location/${string}`; 
type OrganizationReference = `Organization/${string}`; 
type HealthcareServiceReference = `HealthcareServiceReference/${string}`; 
type PractitionerReference = `PractitionerReference/${string}`; 
type ClinicPartipant = {
  actor: {
    reference: string;
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
export type Participant =
  | ClinicPartipant
  | VALocationPartipant
  | VideoPractitionerParticipant
  | CommunityCarePractitionerParticipant;

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

type ContainedResource = VideoVisitResource;

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
  start?: string;
  minutesDuration: number;
  comment?: string;
  reason?: string;
  comment?: string;
  participant: Array<Participant>;
  contained: Array<ContainedResource>;
  legacyVAR: Object;
  type?: FHIRType;
  requestedPeriods?: Array<{
    start: string;
    end: string;
  }>;
  vaos: {
    appointmentType: string;
    isCommunityCare: boolean;
    isPastAppointment?: boolean;
    timeZone?: string;
    isPhoneAppointment?: boolean;
    isExpressCare?: boolean;
  };
};
