import environment from 'platform/utilities/environment';
import compact from 'lodash/compact';
import {
  LocationType,
  FacilityType,
  EMERGENCY_CARE_SERVICES,
} from './constants';
import manifest from './manifest.json';
import { facilityLocatorLatLongOnly } from './utils/featureFlagSelectors';

const apiSettings = {
  credentials: 'include',
  headers: {
    'X-Key-Inflection': 'camel',

    // Pull app name directly from manifest since this config is defined
    // before startApp, and using window.appName here would result in
    // undefined for all requests that use this config.
    'Source-App-Name': manifest.entryName,
  },
};

const railsEngineApi = {
  baseUrl: `${environment.API_URL}/facilities_api/v1`,
  url: `${environment.API_URL}/facilities_api/v1/va`,
  ccUrl: `${environment.API_URL}/facilities_api/v1/ccp`,
  settings: apiSettings,
};

export const getAPI = () => railsEngineApi;

/**
 * Build parameters and URL for facilities API calls
 *
 */
export const resolveParamsWithUrl = ({
  address,
  locationType,
  serviceType,
  page,
  bounds,
  center,
  radius,
  store,
}) => {
  const filterableLocations = ['health', 'benefits', 'provider'];
  const reduxStore = store || require('./facility-locator-entry');
  let latLongOnly = false;

  try {
    latLongOnly = facilityLocatorLatLongOnly(reduxStore.default.getState());
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('error getting redux state from store', reduxStore, e);
  }

  const api = getAPI();

  let facility;
  let service;
  let { url } = api;
  let roundRadius;
  const perPage = 10;
  let communityServiceType = false;
  let multiSpecialties = false;

  switch (locationType) {
    case 'urgent_care':
      if (serviceType === 'UrgentCare') {
        facility = 'health';
        service = 'UrgentCare';
      } else if (serviceType === 'NonVAUrgentCare') {
        facility = 'urgent_care';
        url = api.ccUrl;
        communityServiceType = true;
      }
      break;
    case 'emergency_care':
      if (serviceType === 'EmergencyCare') {
        facility = 'health';
        service = 'EmergencyCare';
      } else if (serviceType === 'NonVAEmergencyCare') {
        facility = 'provider';
        url = api.ccUrl;
        communityServiceType = true;
        multiSpecialties = true;
      }
      break;
    case 'pharmacy':
    case 'provider':
      facility = locationType;
      service = serviceType;
      url = api.ccUrl;
      communityServiceType = true;
      break;
    default:
      facility = locationType;
      service = serviceType;
  }

  if (radius) roundRadius = Math.max(1, radius.toFixed());

  if (facility && communityServiceType) {
    url = `${url}/${facility}`;
  }

  // Emergency care - NonVAEmergencyCare
  //
  // 261QE0002X&specialties[]=282N00000X&
  // specialties[]=282NC0060X&
  // specialties[]=282NR1301X&
  // specialties[]=282NW0100X
  if (multiSpecialties) {
    const sNchar = 'specialties[]=';
    service = `${EMERGENCY_CARE_SERVICES[0]}&${sNchar}${
      EMERGENCY_CARE_SERVICES[1]
    }&${sNchar}${EMERGENCY_CARE_SERVICES[2]}&${sNchar}${
      EMERGENCY_CARE_SERVICES[3]
    }&${sNchar}${EMERGENCY_CARE_SERVICES[4]}`;
  }

  let locationParams;
  if (latLongOnly) {
    locationParams = [
      center && center.length > 0 ? `lat=${center[0]}` : null,
      center && center.length > 0 ? `long=${center[1]}` : null,
    ];
  } else {
    locationParams = [
      address ? `address=${address}` : null,
      ...bounds.map(c => `bbox[]=${c}`),
      center && center.length > 0 ? `latitude=${center[0]}` : null,
      center && center.length > 0 ? `longitude=${center[1]}` : null,
    ];
  }

  return {
    url,
    params: compact([
      facility && !communityServiceType ? `type=${facility}` : null,
      filterableLocations.includes(facility) && service
        ? `${communityServiceType ? 'specialties' : 'services'}[]=${service}`
        : null,
      `page=${page}`,
      `per_page=${perPage}`,
      facility === LocationType.VET_CENTER ? `mobile=false` : null,
      facility === LocationType.HEALTH ? `mobile=false` : null,
      roundRadius ? `radius=${roundRadius}` : null,
      ...locationParams,
    ]).join('&'),
  };
};

// Please use sentence case for all of these
// except 'Vet Centers' and acronyms like IDES.

export const facilityTypes = {
  [FacilityType.VA_HEALTH_FACILITY]: 'VA health',
  [FacilityType.URGENT_CARE]: 'Urgent care',
  [FacilityType.EMERGENCY_CARE]: 'Emergency Care',
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
  Podiatry: 'Podiatry',
  Nutrition: 'Nutrition',
  CaregiverSupport: 'Caregiver support',
};

export const ccUrgentCareLabels = {
  UrgentCare: 'URGENT CARE',
  WalkIn: 'RETAIL/WALK-IN CARE',
};

export const urgentCareServices = {
  AllUrgentCare: 'All in-network urgent care',
  UrgentCare: 'VA urgent care',
  NonVAUrgentCare: 'In-network community urgent care',
};

export const emergencyCareServices = {
  AllEmergencyCare: 'All in-network emergency care',
  EmergencyCare: 'VA emergency care',
  NonVAEmergencyCare: 'In-network community emergency care',
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
    'Integrated Disability Evaluation System (IDES) help',
  Pensions: 'Pensions',
  PreDischargeClaimAssistance: 'Pre-discharge claim help',
  TransitionAssistance: 'Transition help',
  UpdatingDirectDepositInformation: 'Updating direct deposit information',
  VocationalRehabilitationAndEmploymentAssistance:
    'Veteran Readiness and Employment help',
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
  [LocationType.EMERGENCY_CARE]: 'Emergency care',
  [LocationType.CC_PROVIDER]: 'Community providers (in VA’s network)',
  [LocationType.URGENT_CARE_PHARMACIES]:
    'Community pharmacies (in VA’s network)',
  [LocationType.BENEFITS]: 'VA benefits',
  [LocationType.CEMETARY]: 'VA cemeteries',
  [LocationType.VET_CENTER]: 'Vet Centers',
};

export const nonPPMSfacilityTypeOptions = {
  [LocationType.NONE]: 'Choose a facility type',
  [LocationType.HEALTH]: 'VA health',
  [LocationType.BENEFITS]: 'VA benefits',
  [LocationType.CEMETARY]: 'VA cemeteries',
  [LocationType.VET_CENTER]: 'Vet Centers',
};
