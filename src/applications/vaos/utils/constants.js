export const FETCH_STATUS = {
  loading: 'loading',
  notStarted: 'notStarted',
  succeeded: 'succeeded',
  failed: 'failed',
};

export const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

export const PURPOSE_TEXT = {
  'routine-follow-up': 'Routine/Follow-Up',
  'new-issue': 'New Issue',
  'medication-concern': 'Medication Concern',
  other: 'Other',
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
    id: 'CR1',
    name: 'Express care clinic',
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
    group: 'specialty',
    ccId: ['CCAUDHEAR', 'CCAUDRTNE'],
  },
  {
    id: '349',
    name: 'CPAP clinic',
    group: 'specialty',
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
    name: 'Opthamology',
    group: 'specialty',
  },
  {
    id: '408',
    name: 'Optometry',
    group: 'specialty',
    ccId: 'CCOPT',
  },
  {
    id: 'tbd',
    name: 'Podiatry',
    ccId: 'CCPOD',
    group: 'specialty',
  },
  {
    id: '143',
    name: 'Sleep medicine',
    group: 'specialty',
  },
];

export const TYPES_OF_SLEEP_CARE = ['CPAP', 'Home sleep study'];

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
    id: 'italian)',
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
