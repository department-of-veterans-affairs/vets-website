const APPOINTMENT_MAP = {
  '167325': { type: 'noClaim', days: -1 },
  '167326': { type: 'claim', days: -35 }, // Changed to -35 (out of bounds)
  '167327': { type: 'noClaim', days: -32 },
  '167328': { type: 'savedClaim', days: -40 }, // Changed to -40 (out of bounds)
  '167329': { type: 'savedClaim', days: -33 },
  '167330': { type: 'noClaim', days: -45 }, // NEW: Out of bounds, no claim - for testing IntroductionPage alert
};

// Non-matching appointments for filter testing
const NON_MATCHING_APPOINTMENTS = [
  {
    id: 'non-match-1',
    type: 'noClaim',
    localStartTime: '2025-03-20T10:00:00.000-08:00',
    start: '2025-03-20T18:00:00Z',
    end: '2025-03-20T18:30:00Z',
  },
  {
    id: 'non-match-2',
    type: 'noClaim',
    localStartTime: '2025-03-20T20:00:00.000-08:00',
    start: '2025-03-21T04:00:00Z',
    end: '2025-03-21T04:30:00Z',
  },
];

const DEFAULT_APPOINTMENT_TYPE = 'savedClaim';

module.exports = {
  APPOINTMENT_MAP,
  NON_MATCHING_APPOINTMENTS,
  DEFAULT_APPOINTMENT_TYPE,
};
