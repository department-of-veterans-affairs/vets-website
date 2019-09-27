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
    name: 'Clinical pharmacy primary care',
    group: 'primary',
  },
  {
    id: 'CR1',
    name: 'Express care clinic',
    group: 'primary',
  },
  {
    id: '502',
    name: 'Outpatient mental health',
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
    name: 'Opthalmology',
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
    name: 'Sleep medicine and home sleep testing',
    group: 'specialty',
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
