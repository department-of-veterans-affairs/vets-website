/* eslint-disable camelcase */
const commonResponses = require('../../../platform/testing/local-dev-mock-api/common');
const userJson = require('./tests/fixtures/mocks/user.json');
const sipJson = require('./tests/fixtures/mocks/in-progress-forms.json');
const submitJson = require('./tests/fixtures/mocks/form-submit.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': userJson,
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
