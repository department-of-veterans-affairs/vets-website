const delay = require('mocker-api/lib/delay');
const commonResponses = require('../../../../../../platform/testing/local-dev-mock-api/common');
const featureToggles = require('../../../../sign-up/tests/fixtures/toggle-covid-feature.json');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles,
  'POST /covid-research/volunteer/create': (req, res) => {
    return res.status(202).json({
      status: 'accepted',
      code: 202,
    });
  },
  'POST /covid-research/volunteer/update': (req, res) => {
    return res.status(202).json({
      status: 'accepted',
      code: 202,
    });
  },
};

module.exports = delay(responses, 2000);
