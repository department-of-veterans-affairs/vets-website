const allRecipients = {
  data: [
    {
      id: '1013155',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 1013155,
        name: 'Triage Team 1',
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
        name: 'Triage Team 2',
        stationNumber: '989',
        blockedStatus: false,
        preferredTeam: true,
        relationshipType: 'PATIENT',
      },
    },
    {
      id: '2710521',
      type: 'triage_teams_test',
      attributes: {
        triageTeamId: 2710521,
        name: 'DC - Privacy Issues Admin',
        stationNumber: '989',
        blockedStatus: false,
        preferredTeam: true,
        relationshipType: 'PATIENT',
      },
    },
    {
      id: '2710522',
      type: 'triage_teams_test',
      attributes: {
        triageTeamId: 2710522,
        name: 'VA - Record Amendment Admin',
        stationNumber: '989',
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
