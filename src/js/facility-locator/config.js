import environment from '../common/helpers/environment';

// Base URL to be used in API requests.
export const api = {
  url: `${environment.API_URL}/v0/facilities/va`,
  settings: {
    headers: {
      'Content-Type': 'application/json',
    }
  }
};

/* eslint-disable camelcase */
export const facilityTypes = {
  va_health_facility: 'Health',
  va_cemetery: 'Cemetery',
  va_benefits_facility: 'Benefits',
  vet_center: 'Vet Center',
};
/* eslint-enable camelcase */

export const benefitsServices = {
  All: 'All',
  ApplyingForBenefits: 'Applying for benefits',
  BurialClaimAssistance: 'Burial claim help',
  DisabilityClaimAssistance: 'Disability claim help',
  eBenefitsRegistrationAssistance: 'eBenefits registration help',
  EducationAndCareerCounseling: 'Education and career counseling',
  EducationClaimAssistance: 'Education claim help',
  FamilyMemberClaimAssistance: 'Family member claim help',
  HomelessAssistance: 'Help for homeless Veterans',
  VAHomeLoanAssistance: 'VA Home Loan help',
  InsuranceClaimAssistanceAndFinancialCounseling: 'Insurance claim help and financial counseling',
  IntegratedDisabilityEvaluationSystemAssistance: 'Integrated Disability Evaluation System Assistance (IDES)',
  PreDischargeClaimAssistance: 'Predischarge claim help',
  TransitionAssistance: 'Transition help',
  UpdatingDirectDepositInformation: 'Updating direct deposit information',
  VocationalRehabilitationAndEmploymentAssistance: 'Vocational Rehabilitation and Employment (VR&E) help',
};

export const vetCenterServices = [
  'Individual and Group Counseling for eligible Veterans and Services Members',
  'Family counseling for military related issues',
  'Bereavement counseling',
  'Counseling and referral for those that experience a military sexual trauma',
  'Outreach',
  'Substance abuse assessment and referral',
  'Employment referral',
  'Referral for other VA services',
  'Community education',
];

export const healthFacilityServices = [
  'AllergyAndImmunology',
  'Audiology',
  'CardiacSurgery',
  'CardiologyCareServices',
  'ColoRectalSurgery',
  'ComplementaryAlternativeMed',
  'DentalServices',
  'DermatologyCareServices',
  'Diabetes',
  'DiagnosticServices',
  'Dialysis',
  'EmergencyDept',
  'Endocrinology',
  'ENT',
  'EyeCare',
  'Gastroenterology',
  'GeneralSurgery',
  'Gynecology',
  'Hematology',
  'ImagingAndRadiology',
  'InfectiousDisease',
  'InternalMedicine',
  'LabServices',
  'MentalHealthCare',
  'Nephrology',
  'Neurology',
  'Neurosurgery',
  'Oncology',
  'Orthopedics',
  'OutpatientMedicalSpecialty',
  'OutpatientMHCare',
  'OutpatientSpecMHCare',
  'OutpatientSurgicalSpecialty',
  'PainManagement',
  'PlasticSurgery',
  'Podiatry',
  'PrimaryCare',
  'PulmonaryRespiratoryDisease',
  'Rehabilitation',
  'Rheumatology',
  'SleepMedicine',
  'ThoracicSurgery',
  'UrgentCare',
  'Urology',
  'VascularSurgery',
  'VocationalAssistance',
  'WellnessAndPreventativeCare',
];
