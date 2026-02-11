export const REASON_MAX_CHARS = 250;

export const NEW_REASON_MAX_CHARS = 90;

export const FETCH_STATUS = {
  loading: 'loading',
  notStarted: 'notStarted',
  succeeded: 'succeeded',
  failed: 'failed',
};

export const APPOINTMENT_TYPES = {
  vaAppointment: 'vaAppointment',
  ccAppointment: 'ccAppointment',
  request: 'request',
  ccRequest: 'ccRequest',
};

export const APPOINTMENT_STATUS = {
  arrived: 'arrived',
  booked: 'booked',
  cancelled: 'cancelled',
  fulfilled: 'fulfilled',
  noshow: 'noshow',
  pending: 'pending',
  proposed: 'proposed',
};

export const VIDEO_TYPES = {
  clinic: 'CLINIC_BASED',
  adhoc: 'ADHOC',
  mobile: 'MOBILE_ANY',
  storeForward: 'STORE_FORWARD',
};

export const COMP_AND_PEN = 'COMPENSATION & PENSION';

/**
 * @typedef TypeOfCare
 *
 * @property {string} id Numeric id of the type of care
 * @property {string} name Name of the type of care
 * @property {string} label Longer label name for the type of care, used when choosing type
 * @property {string|Array<string>} ccId Id(s) of the associated community care types of
 *   care list in VAR resources
 * @property {string} cceType Id of the associated community care serviceType from the
 *   Lighthouse eligibility api
 * @property {Array<string>} specialities PPMS specialty codes associated with this type of care
 */

export const TYPE_OF_CARE_IDS = {
  PRIMARY_CARE: '323',
  COVID_VACCINE_ID: 'covid',
  PHARMACY_ID: '160',
  SOCIAL_WORK_ID: '125',
  AMPUTATION_ID: '211',
  AUDIOLOGY_ID: '203',
  MOVE_PROGRAM_ID: '372',
  FOOD_AND_NUTRITION_ID: '123',
  SLEEP_MEDICINE_ID: 'SLEEP',
  EYE_CARE_ID: 'EYE',
  CPAP_ID: '349',
  HOME_SLEEP_TESTING_ID: '143',
  OPTOMETRY_ID: '408',
  OPHTHALMOLOGY_ID: '407',
  AUDIOLOGY_ROUTINE_ID: 'CCAUDRTNE',
  AUDIOLOGY_HEARING_ID: 'CCAUDHEAR',
  PODIATRY_ID: 'tbd-podiatry',
  MENTAL_HEALTH_ID: 'MENTAL_HEALTH',
  MENTAL_HEALTH_PRIMARY_CARE_ID: '534',
  MENTAL_HEALTH_SERVICES_ID: '502',
  MENTAL_HEALTH_SUBSTANCE_USE_ID: '513',
};

export const TYPES_OF_CARE = [
  {
    id: TYPE_OF_CARE_IDS.PRIMARY_CARE,
    idV2: 'primaryCare',
    name: 'Primary care',
    group: 'primary',
    ccId: 'CCPRMYRTNE',
    cceType: 'PrimaryCare',
    specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
  },
  {
    id: TYPE_OF_CARE_IDS.PHARMACY_ID,
    idV2: 'clinicalPharmacyPrimaryCare',
    name: 'Pharmacy',
    group: 'primary',
  },
  {
    id: TYPE_OF_CARE_IDS.SOCIAL_WORK_ID,
    idV2: 'socialWork',
    name: 'Social work',
    group: 'mentalHealth',
  },
  {
    id: TYPE_OF_CARE_IDS.AMPUTATION_ID,
    idV2: 'amputation',
    name: 'Amputation care',
    group: 'specialty',
  },
  {
    id: TYPE_OF_CARE_IDS.AUDIOLOGY_ID,
    idV2: 'audiology',
    name: 'Audiology and speech',
    label: 'Audiology and speech (including hearing aid support)',
    group: 'specialty',
    ccId: ['CCAUDHEAR', 'CCAUDRTNE'],
    cceType: 'Audiology',
  },
  {
    id: TYPE_OF_CARE_IDS.MOVE_PROGRAM_ID,
    idV2: 'moveProgram',
    name: 'MOVE! weight management program',
    group: 'specialty',
  },
  {
    id: TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
    idV2: 'foodAndNutrition',
    name: 'Nutrition and food',
    group: 'specialty',
    ccId: 'CCNUTRN',
    cceType: 'Nutrition',
    specialties: ['133V00000X', '133VN1201X', '133N00000X', '133NN1002X'],
  },
  {
    id: TYPE_OF_CARE_IDS.PODIATRY_ID,
    idV2: 'podiatry',
    name: 'Podiatry',
    label: 'Podiatry (only available online for community care appointments)',
    ccId: 'CCPOD',
    group: 'specialty',
    cceType: 'Podiatry',
    specialties: [
      '213E00000X',
      '213EG0000X',
      '213EP1101X',
      '213ES0131X',
      '213ES0103X',
    ],
  },
  {
    id: TYPE_OF_CARE_IDS.SLEEP_MEDICINE_ID,
    name: 'Sleep medicine',
    group: 'specialty',
  },
  {
    id: TYPE_OF_CARE_IDS.EYE_CARE_ID,
    name: 'Eye care',
    group: 'specialty',
  },
  {
    id: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
    idV2: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
    name: 'COVID-19 vaccine',
  },
  {
    id: TYPE_OF_CARE_IDS.MENTAL_HEALTH_ID,
    name: 'Mental health',
    group: 'specialty',
  },
];

export const TYPES_OF_SLEEP_CARE = [
  {
    id: TYPE_OF_CARE_IDS.CPAP_ID,
    idV2: 'cpap',
    name: 'Continuous Positive Airway Pressure (CPAP)',
  },
  {
    id: TYPE_OF_CARE_IDS.HOME_SLEEP_TESTING_ID,
    idV2: 'homeSleepTesting',
    name: 'Sleep medicine and home sleep testing',
  },
];

export const TYPES_OF_EYE_CARE = [
  {
    id: TYPE_OF_CARE_IDS.OPTOMETRY_ID,
    idV2: 'optometry',
    name: 'Optometry',
    ccId: 'CCOPT',
    cceType: 'Optometry',
    specialties: ['152W00000X', '152WC0802X'],
  },
  {
    id: TYPE_OF_CARE_IDS.OPHTHALMOLOGY_ID,
    idV2: 'ophthalmology',
    name: 'Ophthalmology',
  },
];

export const TYPES_OF_MENTAL_HEALTH = [
  {
    id: TYPE_OF_CARE_IDS.MENTAL_HEALTH_PRIMARY_CARE_ID,
    idV2: 'primaryCareMentalHealth',
    name: 'Mental health care in a primary care setting',
    group: 'mentalHealth',
    description:
      'Brief follow-up care with your primary care mental health provider for ' +
      'concerns such as stress, anxiety, irritability, or trouble sleeping.',
  },
  {
    id: TYPE_OF_CARE_IDS.MENTAL_HEALTH_SERVICES_ID,
    idV2: 'outpatientMentalHealth',
    name: 'Mental health care with a specialist',
    group: 'mentalHealth',
    description:
      'For therapy, medication, and other services to help with posttraumatic ' +
      'stress disorder (PTSD), psychological effects of military sexual ' +
      'trauma (MST), depression, grief, anxiety, and other needs.',
  },
  {
    id: TYPE_OF_CARE_IDS.MENTAL_HEALTH_SUBSTANCE_USE_ID,
    idV2: 'individualSubstanceUseDisorder',
    name: 'Substance use problem services',
    group: 'mentalHealth',
    description:
      'For counseling, recovery support, and treatment options for Veterans ' +
      'seeking help with alcohol or other substance use.',
  },
];

export const AUDIOLOGY_TYPES_OF_CARE = [
  {
    ccId: TYPE_OF_CARE_IDS.AUDIOLOGY_ROUTINE_ID,
    idV2: 'audiology-routine exam',
    name: 'Routine hearing exam',
    specialties: ['231H00000X', '237600000X', '261QH0700X'],
  },
  {
    ccId: TYPE_OF_CARE_IDS.AUDIOLOGY_HEARING_ID,
    idV2: 'audiology-hearing aid support',
    name: 'Hearing aid support',
    specialties: ['231H00000X', '237600000X'],
  },
];

export const FACILITY_TYPES = {
  VAMC: {
    id: 'vamc',
    name: 'VA medical center or clinic',
  },
  COMMUNITY_CARE: {
    id: 'communityCare',
    name: 'Community care facility',
  },
};

export const FACILITY_SORT_METHODS = {
  distanceFromResidential: 'distanceFromResidentialAddress',
  distanceFromCurrentLocation: 'distanceFromCurrentLocation',
  distanceFromFacility: 'distanceFromFacility',
  alphabetical: 'alphabetical',
  recentLocations: 'recentLocations',
};

export const LANGUAGES = [
  {
    id: 'english',
    text: 'English',
    value: 'English',
  },
  {
    id: 'chinese',
    text: 'Chinese',
    value: 'Chinese',
  },
  {
    id: 'french',
    text: 'French',
    value: 'French',
  },
  {
    id: 'german',
    text: 'German',
    value: 'German',
  },
  {
    id: 'italian',
    text: 'Italian',
    value: 'Italian',
  },
  {
    id: 'korean',
    text: 'Korean',
    value: 'Korean',
  },
  {
    id: 'portuguese',
    text: 'Portuguese',
    value: 'Portuguese',
  },
  {
    id: 'russian',
    text: 'Russian',
    value: 'Russian',
  },
  {
    id: 'spanish',
    text: 'Spanish',
    value: 'Spanish',
  },
  {
    id: 'tagalog',
    text: 'Tagalog (Filipino)',
    value: 'Tagalog (Filipino)',
  },
  {
    id: 'vietnamese',
    text: 'Vietnamese',
    value: 'Vietnamese',
  },
  {
    id: 'other',
    text: 'Other',
    value: 'Other',
  },
];

export const FLOW_TYPES = {
  DIRECT: 'direct',
  REQUEST: 'request',
};

export const TYPE_OF_VISIT = [
  {
    id: 'clinic',
    name: 'Office visit',
    name2: 'In person',
    serviceName: 'Office Visit',
    vsGUI: 'FACE TO FACE',
    vsGUI2: 'IN-PERSON',
  },
  {
    id: 'phone',
    name: 'Phone call',
    name2: 'By phone',
    serviceName: 'Phone Call',
    vsGUI: 'TELEPHONE',
    vsGUI2: 'PHONE',
  },
  {
    id: 'telehealth',
    name: 'Telehealth (through VA Video Connect)',
    name2: 'Through VA Video Connect (telehealth)',
    serviceName: 'Video Conference',
    vsGUI: 'VIDEO',
    vsGUI2: 'VIDEO',
  },
];

/**
 * @typedef TYPE_OF_VISIT_ID
 * @type {Object}
 * @property {string} clinic
 * @property {string} phone
 * @property {string} telehealth
 */
/**
 * @type {TYPE_OF_VISIT_ID}
 */
export const TYPE_OF_VISIT_ID = TYPE_OF_VISIT.reduce((acc, visit) => {
  acc[visit.id] = visit.id;
  return acc;
}, {});

export const GA_PREFIX = 'vaos';

export const VHA_FHIR_ID = 'urn:oid:2.16.840.1.113883.6.233';

export const DEFAULT_WEEK_DAYS = [
  {
    name: 'Monday',
    abbr: 'Mon',
  },
  {
    name: 'Tuesday',
    abbr: 'Tue',
  },
  {
    name: 'Wednesday',
    abbr: 'Wed',
  },
  {
    name: 'Thursday',
    abbr: 'Thu',
  },
  {
    name: 'Friday',
    abbr: 'Fri',
  },
];

export const ELIGIBILITY_REASONS = {
  notEnabled: 'notEnabled',
  notSupported: 'notSupported',
  noRecentVisit: 'noRecentVisit',
  overRequestLimit: 'overRequestLimit',
  noClinics: 'noClinics',
  noMatchingClinics: 'noMatchingClinics',
  error: 'error',
};

// https://coderepo.mobilehealth.va.gov/projects/VAR/repos/vaos-service/browse/vaos-service/src/main/resources/swagger.json?useDefaultHandler=true
// VaosIneligibilityReasonValueSet
export const INELIGIBILITY_CODES_VAOS = {
  PATIENT_HISTORY_INSUFFICIENT: 'patient-history-insufficient',
  REQUEST_LIMIT_EXCEEDED: 'facility-request-limit-exceeded',
  DIRECT_SCHEDULING_DISABLED: 'facility-cs-direct-disabled',
  REQUEST_SCHEDULING_DISABLED: 'facility-cs-request-disabled',
};

export const CANCELLATION_REASONS = {
  patient: 'pat',
  provider: 'prov',
};

export const ERROR_CODES = [
  {
    code: 9002,
    detail: 'Failure to fetch CC requests from HSRM',
  },
  {
    code: 9003,
    detail: 'Failure to fetch CC requests from HSRM',
  },
  {
    code: 9006,
    detail: 'Failure to fetch CC Appointments from HSRM',
  },
  {
    code: 9007,
    detail: 'Failure to fetch CC Appointments from HSRM',
  },
  {
    code: 9008,
    detail: 'Failure to fetch CC from HSRM - Generic Error',
  },
  {
    code: 10000,
    detail: 'Failure to fetch - Generic Error',
  },
  {
    code: 10001,
    detail: 'Failure to fetch requests from VSP, VVS and/or HSRM',
  },
  {
    code: 10005,
    detail: 'Failure to fetch Booked Appointments',
  },
  {
    code: 10006,
    detail: 'Failure to fetch Requests',
  },
  {
    code: 6000,
    detail: 'There were errors fetching appointments/requests from VSP',
  },
];
export const SERVICE_CATEGORY = [
  {
    id: COMP_AND_PEN,
    displayName: 'Claim exam',
  },
];

export const OH_TRANSITION_SITES = {
  siteName: {
    id: '',
    name: '',
    transitionDate: '',
    telephone: '',
  },
};

// Types of care that are allowed in the OH direct scheduling flow and request flow
export const OH_ENABLED_TYPES_OF_CARE = [
  // 'amputation',
  // 'audiology',
  // 'audiology-hearing aid support',
  // 'audiology-routine exam',
  // 'clinicalPharmacyPrimaryCare',
  // 'cpap',
  'foodAndNutrition',
  // 'homeSleepTesting',
  // 'moveProgram',
  // 'ophthalmology',
  // 'optometry',
  // 'socialWork',
];

export const TRAVEL_CLAIM_MESSAGES = {
  noClaim: 'No claims found.',
  error: 'Travel Pay service unavailable.',
  success: 'Data retrieved successfully.',
};

export const DATE_FORMATS = {
  // Friendly formats for displaying dates to users
  // e.g. January 1, 2023
  friendlyDate: 'MMMM d, yyyy',
  // e.g. Monday, January 1, 2023
  friendlyWeekdayDate: 'EEEE, MMMM d, yyyy',
  // ISO 8601
  // e.g. 2025-05-06T21:00:00
  ISODateTime: "yyyy-MM-dd'T'HH:mm:ss",
  // e.g. 2025-05-06T21:00:00Z
  ISODateTimeUTC: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  // e.g. 2025-05-06T21:00:00-05:00"
  ISODateTimeLocal: "yyyy-MM-dd'T'HH:mm:ssXXX",
  // iCalendar RFC 5545
  // e.g. 20250506T225403
  iCalDateTime: "yyyyMMdd'T'HHmmss",
  // e.g. 20250506T225403Z
  iCalDateTimeUTC: "yyyyMMdd'T'HHmmssXXX",
  // Internal formats for use in source code
  // e.g. 2025-05
  yearMonth: 'yyyy-MM',
  // e.g. 2025-05-21
  yearMonthDay: 'yyyy-MM-dd',
};

export const POST_DRAFT_REFERRAL_APPOINTMENT_CACHE =
  'postDraftReferralAppointmentCache';

export const POST_REFERRAL_REQUEST_CACHE = 'postReferralAppointmentCache';

export const AMBULATORY_PATIENT_SUMMARY = 'ambulatory_patient_summary';

// AVS error message constants
export const AVS_ERROR_EMPTY_BINARY = 'Retrieved empty AVS binary';
export const AVS_ERROR_RETRIEVAL = 'Error retrieving AVS binary';
