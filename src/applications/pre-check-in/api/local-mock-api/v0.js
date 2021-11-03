/* eslint-disable camelcase */

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./mocks/feature.toggles');
const delay = require('mocker-api/lib/delay');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
  'GET /check_in/v2/sessions/:uuid': (req, res) => {
    return res.json({
      id: req.params.uuid,
      payload: {
        demographics: {
          firstName: 'John',
        },
      },
    });
  },
};

module.exports = delay(responses, 2000);
