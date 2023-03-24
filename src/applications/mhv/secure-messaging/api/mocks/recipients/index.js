/* eslint-disable camelcase */
const defaultRecipients = {
  data: [
    {
      id: '1013155',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 1013155,
        name: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
        relationType: 'PATIENT',
        preferredTeam: true,
      },
    },
    {
      id: '2710520',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 2710520,
        name: 'SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
        relationType: 'PATIENT',
        preferredTeam: true,
      },
    },
  ],
  meta: { sort: { name: 'ASC' } },
};

module.exports = {
  defaultRecipients,
};
