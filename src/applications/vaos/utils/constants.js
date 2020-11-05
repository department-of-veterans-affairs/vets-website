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
  gfe: 'MOBILE_GFE',
  clinic: 'CLINIC_BASED',
  adhoc: 'ADHOC',
  mobile: 'MOBILE_ANY',
  storeForward: 'STORE_FORWARD',
};

export const PURPOSE_TEXT = [
  {
    id: 'routine-follow-up',
    short: 'Follow-up/Routine',
    label: 'Routine or follow-up visit',
    serviceName: 'Routine Follow-up',
  },
  {
    id: 'new-issue',
    short: 'New issue',
    label: 'I have a new medical issue',
    serviceName: 'New Issue',
  },
  {
    id: 'medication-concern',
    short: 'Medication concern',
    label: 'I have a concern or question about my medication',
    serviceName: 'Medication Concern',
  },
  {
    id: 'other',
    short: 'My reason isn’t listed',
    label: 'My reason isn’t listed here',
    serviceName: 'Other',
  },
];

export const PODIATRY_ID = 'tbd-podiatry';
export const TYPES_OF_CARE = [
  {
    id: '323',
    name: 'Primary care',
    group: 'primary',
    ccId: 'CCPRMYRTNE',
    cceType: 'PrimaryCare',
  },
  {
    id: '160',
    name: 'Pharmacy',
    group: 'primary',
  },
  {
    id: '502',
    name: 'Mental health',
    group: 'mentalHealth',
  },
  {
    id: '125',
    name: 'Social work',
    group: 'mentalHealth',
  },
  {
    id: '211',
    name: 'Amputation care',
    group: 'specialty',
  },
  {
    id: '203',
    name: 'Audiology and speech',
    label: 'Audiology and speech (including hearing aid support)',
    group: 'specialty',
    ccId: ['CCAUDHEAR', 'CCAUDRTNE'],
    cceType: 'Audiology',
  },
  {
    id: '372',
    name: 'MOVE! weight management program',
    group: 'specialty',
  },
  {
    id: '123',
    name: 'Nutrition and food',
    group: 'specialty',
    ccId: 'CCNUTRN',
    cceType: 'Nutrition',
  },
  {
    id: PODIATRY_ID,
    name: 'Podiatry',
    label: 'Podiatry (only available online for Community Care appointments)',
    ccId: 'CCPOD',
    group: 'specialty',
    cceType: 'Podiatry',
  },
  {
    id: 'SLEEP',
    name: 'Sleep medicine',
    group: 'specialty',
  },
  {
    id: 'EYE',
    name: 'Eye care',
    group: 'specialty',
  },
];

export const TYPES_OF_SLEEP_CARE = [
  {
    id: '349',
    name: 'Continuous Positive Airway Pressure (CPAP)',
  },
  {
    id: '143',
    name: 'Sleep medicine and home sleep testing',
  },
];

export const TYPES_OF_EYE_CARE = [
  {
    id: '408',
    name: 'Optometry',
    ccId: 'CCOPT',
    cceType: 'Optometry',
  },
  {
    id: '407',
    name: 'Ophthalmology',
  },
];

export const AUDIOLOGY_TYPES_OF_CARE = [
  {
    ccId: 'CCAUDRTNE',
    name: 'Routine hearing exam',
  },
  {
    ccId: 'CCAUDHEAR',
    name: 'Hearing aid support',
  },
];

export const FACILITY_TYPES = {
  VAMC: 'vamc',
  COMMUNITY_CARE: 'communityCare',
};

export const FACILITY_SORT_METHODS = {
  distanceFromResidential: 'distanceFromResidentialAddress',
  distanceFromCurrentLocation: 'distanceFromCurrentLocation',
  alphabetical: 'alphabetical',
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
    id: 'office',
    name: 'Office visit',
    serviceName: 'Office Visit',
  },
  {
    id: 'phone',
    name: 'Phone call',
    serviceName: 'Phone Call',
  },
  {
    id: 'telehealth',
    name: 'Telehealth (through VA Video Connect)',
    serviceName: 'Video Conference',
  },
];

// todo: not used, delete?
export const DISTANCES = [
  {
    id: '25',
    name: 'Up to 25 miles',
  },
  {
    id: '50',
    name: 'Up to 50 miles',
  },
  {
    id: '50+',
    name: 'Further than 50 miles',
  },
];

export const CALENDAR_INDICATOR_TYPES = {
  CHECK: 'check',
  BUBBLES: 'bubbles',
};

export const MENTAL_HEALTH = '502';
export const EXPRESS_CARE = 'CR1';

export const GA_PREFIX = 'vaos';

export const VHA_FHIR_ID = 'urn:oid:2.16.840.1.113883.6.233';

export const FREE_BUSY_TYPES = {
  busy: 'busy',
  free: 'free',
  busyUnavailable: 'busy-unavailable',
  busyTentative: 'busy-tentative',
};

export const UNABLE_TO_REACH_VETERAN_DETCODE = 'DETCODE23';

export const EXPRESS_CARE_ERROR_REASON = {
  error: 'error',
  noActiveFacility: 'noActiveFacility',
};
