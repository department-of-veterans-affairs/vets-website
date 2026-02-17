import environment from 'platform/utilities/environment';
import compact from 'lodash/compact';
import {
  LocationType,
  FacilityType,
  EMERGENCY_CARE_SERVICES,
} from './constants';
import manifest from './manifest.json';

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
  baseUrl: `${environment.API_URL}/facilities_api/v2`,
  url: `${environment.API_URL}/facilities_api/v2/va`,
  ccUrl: `${environment.API_URL}/facilities_api/v2/ccp`,
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
}) => {
  const filterableLocations = ['health', 'benefits', 'provider'];
  const api = getAPI();

  let facility;
  let service;
  let { url } = api;
  let roundRadius;
  let perPage = 10;
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
      perPage = 15;
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
    service = `${EMERGENCY_CARE_SERVICES[0]}&${sNchar}${EMERGENCY_CARE_SERVICES[1]}&${sNchar}${EMERGENCY_CARE_SERVICES[2]}&${sNchar}${EMERGENCY_CARE_SERVICES[3]}&${sNchar}${EMERGENCY_CARE_SERVICES[4]}`;
  }

  const locationParams = [
    address ? `address=${address}` : null,
    ...bounds.map(c => `bbox[]=${c}`),
    center && center.length > 0 ? `latitude=${center[0]}` : null,
    center && center.length > 0 ? `longitude=${center[1]}` : null,
  ];

  const postLocationParams = {};
  locationParams.forEach(param => {
    if (param === null) return;
    const arr = param.split('=');

    if (arr[0] === 'bbox[]') {
      if (!('bbox' in postLocationParams)) {
        postLocationParams.bbox = [];
      }
      postLocationParams.bbox.push(param.split('=')[1]);
    } else {
      postLocationParams[arr[0]] = arr[1];
    }
  });

  const postParamsObj = {
    type: facility && !communityServiceType ? facility : null,
    services:
      filterableLocations.includes(facility) && service ? [service] : null,
    page,
    // eslint-disable-next-line camelcase
    per_page: perPage,
    mobile:
      facility === LocationType.VET_CENTER || facility === LocationType.HEALTH
        ? false
        : null,
    radius: roundRadius || null,
    ...postLocationParams,
  };

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
    postParams: Object.fromEntries(
      Object.entries(postParamsObj).filter(([_, v]) => v != null),
    ),
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
  [FacilityType.VA_CEMETERY]: 'VA cemeteries',
  [FacilityType.VA_BENEFITS_FACILITY]: 'Benefits',
  [FacilityType.VET_CENTER]: 'Vet Centers',
  [LocationType.HEALTH]: 'VA health',
  [LocationType.CC_PROVIDER]: 'Community providers (in VA’s network)',
  [LocationType.CEMETERY]: 'VA cemeteries',
  [LocationType.BENEFITS]: 'VA benefits',
};

export const healthServices = {
  All: 'All VA health services',
  PrimaryCare: 'Primary care',
  MentalHealth: 'Mental health care',
  Dental: 'Dental services',
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
  [LocationType.HEALTH]: 'VA health',
  [LocationType.URGENT_CARE]: 'Urgent care',
  [LocationType.EMERGENCY_CARE]: 'Emergency care',
  [LocationType.CC_PROVIDER]: 'Community providers (in VA’s network)',
  [LocationType.URGENT_CARE_PHARMACIES]:
    'Community pharmacies (in VA’s network)',
  [LocationType.BENEFITS]: 'VA benefits',
  [LocationType.CEMETERY]: 'VA cemeteries',
  [LocationType.VET_CENTER]: 'Vet Centers',
};

export const nonPPMSfacilityTypeOptions = {
  [LocationType.HEALTH]: 'VA health',
  [LocationType.BENEFITS]: 'VA benefits',
  [LocationType.CEMETERY]: 'VA cemeteries',
  [LocationType.VET_CENTER]: 'Vet Centers',
};
