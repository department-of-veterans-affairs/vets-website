/* eslint-disable camelcase */
const allRecipients = {
  data: [
    {
      id: '1013155',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 1013155,
        name: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
        display: {
          name: 'Test',
          facility: 'Portland',
          type: 'Pharmacy',
        },
        stationNumber: '989',
        blockedStatus: false,
        preferredTeam: true,
        relationshipType: 'PATIENT',
      },
    },
  ],
  meta: {
    associatedTriageGroups: 1,
    associatedBlockedTriageGroups: 0,
    sort: {
      name: 'ASC',
    },
  },
};

module.exports = {
  allRecipients,
};
