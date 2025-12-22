/**
 * Creates an appeal for /v0/appeals
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {string} overrides.id - Appeal ID
 * @param {string} overrides.type - Appeal type (legacyAppeal, appeal, supplementalClaim, higherLevelReview)
 * @param {string} overrides.eventType - Event type for the first event (e.g., 'claim_decision')
 * @param {string} overrides.eventDate - Date of the first event ("Received on..." text)
 * @param {string} overrides.lastEventDate - Date of the last event ("Last updated..." text)
 * @param {string} overrides.programArea - Program area (compensation, pension, insurance, etc.)
 * @param {string} overrides.description - Issue description
 * @param {number} overrides.issuesCount - Number of issues to generate
 * @param {string} overrides.statusType - Status type for the appeal
 * @param {Array} overrides.evidenceSubmissions - Evidence submissions array (use createEvidenceSubmission)
 * @returns {Object} Appeal object
 */
export const createAppeal = ({
  id = '987654321',
  type = 'legacyAppeal',
  statusType = 'pending_soc',
  eventType = 'nod',
  eventDate = '2025-01-01',
  lastEventDate = '2025-01-15',
  programArea = 'compensation',
  aod = false,
  appealAction = null,
  location = 'aoj',
  issuesCount = 1,
  description = 'Tinnitus',
  evidenceSubmissions = [],
  docket = null,
}) => {
  const events = [
    { type: eventType, date: eventDate },
    { type: 'other_event', date: lastEventDate },
  ];

  const issues = Array.from({ length: issuesCount }, (_, i) => ({
    description: `Issue ${i + 1}`,
  }));

  return {
    id,
    type,
    attributes: {
      status: {
        type: statusType,
        details: {},
      },
      events,
      programArea,
      active: true,
      location,
      aod,
      aoj: 'vba',
      type: appealAction,
      issues,
      description,
      evidenceSubmissions,
      docket,
      alerts: [],
      incompleteHistory: false,
      updated: '2025-01-15T12:00:00-05:00',
    },
  };
};

/**
 * Creates a docket object for appeals
 * @returns {Object} Docket object with default values for a legacy appeal
 */
export const createDocket = ({
  front = false,
  type = null,
  totalAllDockets = null,
  eligibleToSwitch = false,
  switchDueDate = null,
  eta = null,
} = {}) => ({
  front,
  total: 123456,
  ahead: 12345,
  month: '2025-06-01',
  docketMonth: '2025-01-01',
  type,
  totalAllDockets,
  eligibleToSwitch,
  switchDueDate,
  eta,
});
