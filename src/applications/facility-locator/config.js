import environment from 'platform/utilities/environment';
import compact from 'lodash/compact';
import { LocationType, FacilityType } from './constants';
import manifest from './manifest.json';

// Base URL to be used in API requests.
export const api = {
  baseUrl: `${environment.API_URL}/v1/facilities`,
  url: `${environment.API_URL}/v1/facilities/va`,
  ccUrl: `${environment.API_URL}/v1/facilities/ccp`,
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
 * Build parameters and URL for facilities API calls
 *
 */
export const resolveParamsWithUrl = (
  address,
  locationType,
  serviceType,
  page,
  bounds,
  center,
  radius,
  allUrgentCare = false,
) => {
  const filterableLocations = ['health', 'benefits', 'provider'];
  let facility;
  let service;
  let url = api.url;
  let roundRadius;
  let perPage = 20;

  switch (locationType) {
    case 'urgent_care':
      if (serviceType === 'UrgentCare') {
        facility = 'health';
        service = 'UrgentCare';
      } else if (serviceType === 'NonVAUrgentCare' && allUrgentCare) {
        facility = 'urgent_care';
        url = api.ccUrl;
        perPage = 40;
      } else if (serviceType === 'NonVAUrgentCare' && !allUrgentCare) {
        facility = 'urgent_care';
        url = api.ccUrl;
      }
      break;
    case 'pharmacy':
    case 'provider':
      facility = locationType;
      service = serviceType;
      url = api.ccUrl;
      break;
    default:
      facility = locationType;
      service = serviceType;
  }

  if (radius) roundRadius = Math.max(1, radius.toFixed());

  return {
    url,
    params: compact([
      address ? `address=${address}` : null,
      ...bounds.map(c => `bbox[]=${c}`),
      facility ? `type=${facility}` : null,
      filterableLocations.includes(facility) && service
        ? `${url === api.ccUrl ? 'specialties' : 'services'}[]=${service}`
        : null,
      `page=${page}`,
      `per_page=${perPage}`,
      facility === LocationType.VET_CENTER ? `exclude_mobile=true` : null,
      roundRadius ? `radius=${roundRadius}` : null,
      center && center.length > 0 ? `latitude=${center[0]}` : null,
      center && center.length > 0 ? `longitude=${center[1]}` : null,
    ]).join('&'),
  };
};

// Please use sentence case for all of these
// except 'Vet Centers' and acronyms like IDES.

export const facilityTypes = {
  [FacilityType.VA_HEALTH_FACILITY]: 'VA health',
  [FacilityType.URGENT_CARE]: 'Urgent care',
  [FacilityType.URGENT_CARE_PHARMACIES]:
    'Community pharmacies (in VA’s network)',
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
  PrimaryCare: 'Primary care',
  MentalHealthCare: 'Mental health care',
  Covid19Vaccine: 'COVID-19 vaccines',
  DentalServices: 'Dental services',
  UrgentCare: 'Urgent care',
  EmergencyCare: 'Emergency care',
  Audiology: 'Audiology',
  Cardiology: 'Cardiology',
  Dermatology: 'Dermatology',
  Gastroenterology: 'Gastroenterology',
  Gynecology: 'Gynecology',
  Ophthalmology: 'Ophthalmology',
  Optometry: 'Optometry',
  Orthopedics: 'Orthopedics',
  Urology: 'Urology',
  WomensHealth: "Women's health",
};

export const ccUrgentCareLabels = {
  UrgentCare: 'URGENT CARE',
  WalkIn: 'RETAIL/WALK-IN CARE',
};

export const urgentCareServices = {
  AllUrgentCare: 'All urgent care',
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
  VAHomeLoanAssistance: 'VA home loan help',
  InsuranceClaimAssistanceAndFinancialCounseling:
    'Insurance claim help and financial counseling',
  IntegratedDisabilityEvaluationSystemAssistance:
    'Integrated Disability Evaluation System Assistance (IDES)',
  Pensions: 'Pensions',
  PreDischargeClaimAssistance: 'Pre-discharge claim help',
  TransitionAssistance: 'Transition help',
  UpdatingDirectDepositInformation: 'Updating direct deposit information',
  VocationalRehabilitationAndEmploymentAssistance:
    'Vocational rehabilitation and employment help',
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
  [LocationType.NONE]: 'Choose a facility type',
  [LocationType.HEALTH]: 'VA health',
  [LocationType.URGENT_CARE]: 'Urgent care',
  [LocationType.CC_PROVIDER]: 'Community providers (in VA’s network)',
  [LocationType.URGENT_CARE_PHARMACIES]:
    'Community pharmacies (in VA’s network)',
  [LocationType.BENEFITS]: 'VA benefits',
  [LocationType.CEMETARY]: 'VA cemeteries',
  [LocationType.VET_CENTER]: 'Vet Centers',
};
