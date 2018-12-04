/* eslint-disable arrow-body-style */
import environment from '../../platform/utilities/environment';

// TODO: Remove me when done bug fixing
// const environment = {
//   API_URL: 'http://staging-api.va.gov',
// };

// Base URL to be used in API requests.
export const api = {
  baseUrl: `${environment.API_URL}/v0/facilities`,
  url: `${environment.API_URL}/v0/facilities/va`,
  settings: {
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
export const ccLocatorEnabled = () => {
  return !environment.isProduction();
};

/* eslint-disable camelcase */
export const facilityTypes = {
  all: 'All Facilities',
  va_health_facility: 'VA Health',
  va_cemetery: 'Cemetery',
  va_benefits_facility: 'Benefits',
  vet_center: 'Vet Center',
  health: 'VA Health',
  cc_provider: 'Community Care (Non-VA Health)',
  cemetery: 'Cemetery',
  benefits: 'Benefits',
};
/* eslint-enable camelcase */

export const healthServices = {
  All: 'Show all facilities',
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
  All: 'Show all facilities',
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
  'Individual and group counseling for Veterans, Servicemembers, and their families',
  'Family counseling for military related issues',
  'Bereavement (grief) counseling',
  'Military sexual trauma counseling and referral',
  'Community outreach and education',
  'Substance abuse assessment and referral',
  'Employment referral',
  'Referral of other VA services',
];
