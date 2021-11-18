/* eslint-disable camelcase */

const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');
const mockSessions = require('./mocks/v2/sessions.responses');

const featureToggles = require('./mocks/feature.toggles');
const delay = require('mocker-api/lib/delay');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    preCheckInEnabled: true,
  }),
  // v2
  'GET /check_in/v2/sessions/:uuid': (req, res) => {
    return res.json(mockSessions.mocks.get(req.params));
  },
  'POST /check_in/v2/sessions': (req, res) => {
    const { last4, lastName } = req.body?.session || {};
    if (!last4 || !lastName) {
      return res.status(400).json(mockSessions.createMockFailedResponse());
    }
    return res.json(mockSessions.mocks.post(req.body));
  },
};

module.exports = delay(responses, 2000);
