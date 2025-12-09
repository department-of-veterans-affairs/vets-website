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
 * @returns {Object} Appeal object
 */
export const createAppeal = ({
  id = '987654321',
  type = 'legacyAppeal',
  eventType = 'nod',
  eventDate = '2025-01-01',
  lastEventDate = '2025-01-15',
  programArea = 'compensation',
  description = 'Tinnitus',
  issuesCount = 1,
  statusType = 'pending_soc',
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
      issues,
      description,
      evidenceSubmissions: [],
    },
  };
};
