type TypeOfCareId = 'CR1' | '323';

interface FHIRType {
  coding: [
    {
      code: TypeOfCareId;
      display: string;
    }
  ];
}
type ClinicPartipant = {
  actor: {
    reference: string;
    display: string;
  };
};
type VALocationPartipant = {
  actor: {
    reference: string;
  };
};
type VideoPractitionerParticipant = {
  actor: {
    reference: string;
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

type LocationId = `Location/${string}`; 
type VideoVisitResource = {
  resourceType: 'HealthcareService';
  id: string;
  type: [
    {
      text: 'Patient Virtual Meeting Room';
    }
  ];
  providedBy: {
    reference: string;
  };
  location?: {
    // reference: string;
    reference: LocationId;
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
  id: string;
  created?: string;
  cancelationReason?: {
    text: string;
  };
  resourceType: 'Appointment';
  status: string;
  description: string;
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
