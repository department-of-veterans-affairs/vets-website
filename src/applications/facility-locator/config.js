import environment from 'platform/utilities/environment';
import compact from 'lodash/compact';
import { LocationType, FacilityType } from './constants';
import manifest from './manifest.json';

// Base URL to be used in API requests.
export const api = {
  baseUrlV0: `${environment.API_URL}/v0/facilities`,
  urlV0: `${environment.API_URL}/v0/facilities/va`,
  baseUrl: `${environment.API_URL}/v1/facilities`,
  url: `${environment.API_URL}/v1/facilities/va`,
  ccUrl: `${environment.API_URL}/v0/facilities/ccp`,
  settings: {
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',

      // Pull app name directly from manifest since this config is defined
      // before startApp, and using window.appName here would result in
      // undefined for all requests that use this config.
      'Source-App-Name': manifest.entryName,
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

/**
 * Build parameters and URL for facilities API calls
 *
 */
export const resolveParamsWithUrl = (
  address,
  locationType,
  serviceType,
  page,
  bounds,
  apiVersion,
) => {
  const filterableLocations = ['health', 'benefits', 'cc_provider'];
  let facility;
  let service;
  let url;
  switch (locationType) {
    case 'urgent_care':
      if (!serviceType || serviceType === 'UrgentCare') {
        facility = 'health';
        service = 'UrgentCare';
        url = apiVersion === 1 ? api.url : api.urlV0;
      }
      if (serviceType === 'NonVAUrgentCare') {
        facility = 'cc_urgent_care';
        url = api.ccUrl;
      }
      break;
    case 'cc_pharmacy':
    case 'cc_provider':
      facility = locationType;
      service = serviceType;
      url = api.ccUrl;
      break;
    default:
      facility = locationType;
      service = serviceType;
      url = apiVersion === 1 ? api.url : api.urlV0;
  }

  return {
    url,
    params: compact([
      address ? `address=${address}` : null,
      ...bounds.map(c => `bbox[]=${c}`),
      facility ? `type=${facility}` : null,
      filterableLocations.includes(facility) && service
        ? `services[]=${service}`
        : null,
      `page=${page}`,
      `per_page=20`,
      url === api.ccUrl ? `trim=true` : null,
    ]).join('&'),
  };
};

export const facilityTypes = {
  [FacilityType.VA_HEALTH_FACILITY]: 'VA health',
  [FacilityType.URGENT_CARE]: 'Urgent care',
  [FacilityType.URGENT_CARE_FARMACIES]:
    'Urgent care pharmacies (in VA’s network)',
  [FacilityType.VA_CEMETARY]: 'VA cemeteries',
  [FacilityType.VA_BENEFITS_FACILITY]: 'Benefits',
  [FacilityType.VET_CENTER]: 'Vet Centers',
  [LocationType.HEALTH]: 'VA health',
  [LocationType.CC_PROVIDER]: 'Community providers (in VA’s network)',
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

export const ccUrgentCareLabels = {
  UrgentCare: 'URGENT CARE',
  WalkIn: 'RETAIL/WALK-IN CARE',
};

export const urgentCareServices = {
  UrgentCare: 'VA urgent care',
  NonVAUrgentCare: 'Community urgent care providers (in VA’s network)',
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

export const facilityTypesOptions = {
  [LocationType.HEALTH]: 'VA health',
  [LocationType.URGENT_CARE]: 'Urgent care',
  [LocationType.CC_PROVIDER]: 'Community providers (in VA’s network)',
  [LocationType.URGENT_CARE_FARMACIES]:
    'Urgent care pharmacies (in VA’s network)',
  [LocationType.BENEFITS]: 'VA benefits',
  [LocationType.CEMETARY]: 'VA cemeteries',
  [LocationType.VET_CENTER]: 'Vet centers',
};
