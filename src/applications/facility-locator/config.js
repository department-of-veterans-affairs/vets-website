import environment from '../../platform/utilities/environment';
import { LocationType, FacilityType } from './constants';

// TODO: Remove me when done bug fixing
// const environment = {
//   API_URL: 'http://staging-api.va.gov',
// };

// Base URL to be used in API requests.
export const api = {
  baseUrl: `${environment.API_URL}/v0/facilities`,
  url: `${environment.API_URL}/v0/facilities/va`,
  settings: {
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',
    },
  },
};

/**
 * Feature Flag Function
 *
 * Determines, based on enviornment type, whether or not to
 * enable Community Care Provider Locator features of the
 * existing Facility Locator App.
 */
export const ccLocatorEnabled = () => true;

export const facilityTypes = {
  // [LocationType.ALL]: 'All Facilities',
  [FacilityType.VA_HEALTH_FACILITY]: 'VA health',
  [FacilityType.VA_CEMETARY]: 'VA cemeteries',
  [FacilityType.VA_BENEFITS_FACILITY]: 'Benefits',
  [FacilityType.VET_CENTER]: 'Vet Centers',
  [LocationType.HEALTH]: 'VA health',
  [LocationType.CC_PROVIDER]: 'VA Community Care (In network)',
  [LocationType.CEMETARY]: 'VA cemeteries',
  [LocationType.BENEFITS]: 'VA benefits',
};

export const healthServices = {
  All: 'All VA health services',
  PrimaryCare: 'Primary Care',
  MentalHealthCare: 'Mental Health Care',
  DentalServices: 'Dental Services',
  UrgentCare: 'Urgent Care',
  EmergencyCare: 'Emergency Care',
  Audiology: 'Audiology',
  Cardiology: 'Cardiology',
  Dermatology: 'Dermatology',
  Gastroenterology: 'Gastroenterology',
  Gynecology: 'Gynecology',
  Ophthalmology: 'Ophthalmology',
  Optometry: 'Optometry',
  Orthopedics: 'Orthopedics',
  Urology: 'Urology',
  WomensHealth: "Women's Health",
};

export const benefitsServices = {
  All: 'All VA benefit services',
  ApplyingForBenefits: 'Applying for benefits',
  BurialClaimAssistance: 'Burial claim help',
  DisabilityClaimAssistance: 'Disability claim help',
  eBenefitsRegistrationAssistance: 'eBenefits registration help',
  EducationAndCareerCounseling: 'Education and career counseling',
  EducationClaimAssistance: 'Education claim help',
  FamilyMemberClaimAssistance: 'Family member claim help',
  HomelessAssistance: 'Help for homeless Veterans',
  VAHomeLoanAssistance: 'VA Home Loan help',
  InsuranceClaimAssistanceAndFinancialCounseling:
    'Insurance claim help and financial counseling',
  IntegratedDisabilityEvaluationSystemAssistance:
    'Integrated Disability Evaluation System Assistance (IDES)',
  Pensions: 'Pensions',
  PreDischargeClaimAssistance: 'Pre-discharge claim help',
  TransitionAssistance: 'Transition help',
  UpdatingDirectDepositInformation: 'Updating direct deposit information',
  VocationalRehabilitationAndEmploymentAssistance:
    'Vocational Rehabilitation and Employment (VR&E) help',
};

export const vetCenterServices = [
  'Individual and group counseling for Veterans, service members, and their families',
  'Family counseling for military related issues',
  'Bereavement (grief) counseling',
  'Military sexual trauma counseling and referral',
  'Community outreach and education',
  'Substance abuse assessment and referral',
  'Employment referral',
  'Referral of other VA services',
];
