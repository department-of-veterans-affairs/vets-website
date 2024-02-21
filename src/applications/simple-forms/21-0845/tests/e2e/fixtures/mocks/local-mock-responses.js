/* eslint-disable camelcase */
// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/simple-forms/21-0845/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const mockSubmit = require('../../../../../shared/tests/e2e/fixtures/mocks/application-submit.json');

const responses = {
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'form210845', value: true },
        { name: 'showExpandableVamcAlert', value: true },
        { name: 'facilityLocatorShowCommunityCares', value: true },
        { name: 'profile_show_profile_2.0', value: false },
        { name: 'vaOnlineScheduling', value: true },
        { name: 'vaOnlineSchedulingCancel', value: true },
        { name: 'vaOnlineSchedulingRequests', value: true },
        { name: 'vaOnlineSchedulingCommunityCare', value: true },
        { name: 'vaOnlineSchedulingDirect', value: true },
        { name: 'vaOnlineSchedulingPast', value: true },
        { name: 'vaOnlineSchedulingExpressCare', value: true },
        { name: 'vaOnlineSchedulingExpressCareNew', value: true },
        { name: 'vaOnlineSchedulingFlatFacilityPage', value: true },
        { name: 'vaOnlineSchedulingProviderSelection', value: true },
        { name: 'vaOnlineSchedulingCheetah', value: true },
        { name: 'vaOnlineSchedulingHomepageRefresh', value: true },
        { name: 'vaOnlineSchedulingUnenrolledVaccine', value: true },
        { name: 'vaOnlineSchedulingVAOSServiceCCAppointments', value: false },
        { name: 'vaOnlineSchedulingVAOSServiceVAAppointments', value: false },
        { name: 'vaOnlineSchedulingVAOSServiceRequests', value: false },
        { name: 'edu_section_103', value: true },
        { name: 'vaViewDependentsAccess', value: false },
        { name: 'gibctEybBottomSheet', value: true },
      ],
    },
  },

  'POST /simple_forms_api/v1/simple_forms': mockSubmit,
};

module.exports = responses;
/* eslint-enable camelcase */
