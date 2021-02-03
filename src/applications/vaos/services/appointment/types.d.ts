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
  contained: Array;
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
