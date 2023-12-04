/* eslint-disable camelcase */
// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/simple-forms/21-0845/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockSipPut = require('./sipPut.json');
const mockSipGet = require('./sipGet.json');
const mockSubmit = require('../../../../../shared/tests/e2e/fixtures/mocks/application-submit.json');

const responses = {
  'GET /v0/user': {
    data: {
      attributes: {
        profile: {
          sign_in: {
            service_name: 'idme',
          },
          email: 'john.preparer@example.com',
          loa: { current: 3 }, // change to 2 to mock User not identity-verified
          first_name: 'John',
          middle_name: '',
          last_name: 'Preparer',
          gender: 'F',
          birth_date: '1985-01-01',
          verified: true, // change to false to mock User not identity-verified
        },
        veteran_status: {
          status: 'OK',
          is_veteran: true,
          served_in_military: true,
        },
        in_progress_forms: [
          // uncomment object below to see signed-in SIP-alert
          // {
          //   form: '20-10206',
          //   metadata: {
          //     savedAt: 1700155167499,
          //     submission: {
          //       status: false,
          //       errorMessage: false,
          //       id: false,
          //       timestamp: 1700155167494,
          //       hasAttemptedSubmit: true,
          //     },
          //     createdAt: 1700155105,
          //     expiresAt: 1705339168,
          //     lastUpdated: 1700155168,
          //     inProgressFormId: 27056,
          //   },
          //   lastUpdated: 1700155168,
          // },
        ],
        prefills_available: ['20-10206'],
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'evss-claims',
          'form526',
          'user-profile',
          'health-records',
          'rx',
          'messaging',
        ],
        va_profile: {
          status: 'OK',
          birth_date: '19850101',
          family_name: 'Preparer',
          gender: 'M',
          given_names: ['John', ''],
          active_status: 'active',
          facilities: [
            {
              facility_id: '983',
              is_cerner: false,
            },
            {
              facility_id: '984',
              is_cerner: false,
            },
          ],
        },
      },
    },
    meta: { errors: null },
  },

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

  'GET /v0/in_progress_forms/20-10206': mockSipGet,
  'PUT /v0/in_progress_forms/20-10206': mockSipPut,

  'POST /simple_forms_api/v1/simple_forms': mockSubmit,
};

module.exports = responses;
/* eslint-enable camelcase */
