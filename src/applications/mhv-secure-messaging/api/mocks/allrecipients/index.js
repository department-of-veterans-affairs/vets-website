/* eslint-disable camelcase */
const allRecipients = {
  data: [
    {
      id: '1013155',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 1013155,
        name: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
        stationNumber: '989',
        blockedStatus: false,
        preferredTeam: true,
        relationshipType: 'PATIENT',
      },
    },
    {
      id: '2710520',
      type: 'triage_teams_test',
      attributes: {
        triageTeamId: 2710520,
        name: 'SM_TO_VA_GOV_TRIAGE_GROUP_TEST _ OLD',
        stationNumber: '110',
        blockedStatus: false,
        preferredTeam: true,
        relationshipType: 'PATIENT',
      },
    },
  ],
  meta: {
    associatedTriageGroups: 2,
    associatedBlockedTriageGroups: 0,
    sort: {
      name: 'ASC',
    },
  },
};

module.exports = {
  allRecipients,
};
