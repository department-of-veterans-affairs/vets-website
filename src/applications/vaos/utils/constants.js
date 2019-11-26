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

export const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
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
    short: 'My reason is not listed here',
    label: 'My reason is not listed here',
    serviceName: 'Other',
  },
];

export const REASON_ADDITIONAL_INFO_TITLES = {
  default:
    "Please give us additional details about your appointment. This will help us schedule your appointment with the right provider or facility. Please also let us know if you have any scheduling issues, like you can't have an appointment on a certain day.",
  other:
    "Please give us additional details about what type of appointment you’re looking for. This will help us find you the right provider or facility for your appointment. Please also let us know if you have any scheduling issues, like you can't have an appointment on a certain day.",
};

export const TYPES_OF_CARE = [
  {
    id: '323',
    name: 'Primary care',
    group: 'primary',
    ccId: 'CCPRMYRTNE',
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
    name: 'Audiology and speech (including hearing aid support)',
    group: 'specialty',
    ccId: ['CCAUDHEAR', 'CCAUDRTNE'],
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
  },
  {
    id: '407',
    name: 'Ophthalmology',
    group: 'specialty',
  },
  {
    id: '408',
    name: 'Optometry',
    group: 'specialty',
    ccId: 'CCOPT',
  },
  {
    id: 'tbd-podiatry',
    name: 'Podiatry',
    ccId: 'CCPOD',
    group: 'specialty',
  },
  {
    id: 'SLEEP',
    name: 'Sleep medicine',
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

export const FACILITY_TYPES = {
  VAMC: 'vamc',
  COMMUNITY_CARE: 'communityCare',
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

export const AUDIOLOGY_TYPES_OF_CARE = [
  {
    id: 'CCAUDRTNE',
    name: 'Routine hearing exam',
  },
  {
    id: 'CCAUDHEAR',
    name: 'Hearing aid support',
  },
];

export const CANCELLED_APPOINTMENT_SET = new Set([
  'NO-SHOW',
  'CANCELLED BY CLINIC',
  'NO-SHOW & AUTO RE-BOOK',
  'CANCELLED BY CLINIC & AUTO RE-BOOK',
  'INPATIENT APPOINTMENT',
  'CANCELLED BY PATIENT',
  'CANCELLED BY PATIENT & AUTO-REBOOK',
  'NO ACTION TAKEN',
]);

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
    name: 'VA Video Connect',
    serviceName: 'Video Conference',
  },
];

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

export const REASON_MAX_CHARS = {
  request: 100,
  direct: 150,
};

export const DISABLED_LIMIT_VALUE = 0;
export const PRIMARY_CARE = '323';
export const MENTAL_HEALTH = '502';
export const DIRECT_SCHEDULE_TYPES = new Set([PRIMARY_CARE, '502']);
