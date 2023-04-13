/* eslint-disable camelcase */
const commonResponses = require('../../../platform/testing/local-dev-mock-api/common');
const sipJson = require('./tests/fixtures/mocks/in-progress-forms.json');
const submitJson = require('./tests/fixtures/mocks/form-submit.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': {
    data: {
      attributes: {
        profile: {
          sign_in: {
            service_name: 'idme',
          },
          email: 'fake@fake.com',
          loa: { current: 3 },
          first_name: 'Jane',
          middle_name: '',
          last_name: 'Doe',
          gender: 'F',
          birth_date: '1985-01-01',
          verified: true,
        },
        veteran_status: {
          status: 'OK',
          is_veteran: true,
          served_in_military: true,
        },
        in_progress_forms: [],
        prefills_available: [],
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
          birth_date: '19511118',
          family_name: 'Hunter',
          gender: 'M',
          given_names: ['Julio', 'E'],
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
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        ...commonResponses['GET /v0/feature_toggles'].data.features,
        { name: 'showExpandableVamcAlert', value: false },
        { name: 'vaOnlineScheduling', value: false },
        { name: 'vaOnlineSchedulingCancel', value: false },
        { name: 'vaOnlineSchedulingRequests', value: false },
        { name: 'vaOnlineSchedulingCommunityCare', value: false },
        { name: 'vaOnlineSchedulingDirect', value: false },
        { name: 'vaOnlineSchedulingPast', value: false },
        { name: 'vaOnlineSchedulingExpressCare', value: false },
        { name: 'vaOnlineSchedulingExpressCareNew', value: false },
        { name: 'vaOnlineSchedulingFlatFacilityPage', value: false },
        { name: 'vaOnlineSchedulingProviderSelection', value: false },
        { name: 'vaOnlineSchedulingCheetah', value: false },
        { name: 'vaOnlineSchedulingHomepageRefresh', value: false },
        { name: 'vaOnlineSchedulingUnenrolledVaccine', value: false },
        { name: 'edu_section_103', value: false },
      ],
    },
  },
  'GET /v0/in_progress_forms/21-10210': sipJson,
  'PUT /v0/in_progress_forms/21-10210': sipJson,
  'POST /forms_api/v1/simple_forms': submitJson,
};
/* eslint-enable camelcase */

module.exports = responses;
