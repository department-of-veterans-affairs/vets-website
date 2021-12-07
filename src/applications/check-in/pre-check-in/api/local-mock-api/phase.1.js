/* eslint-disable camelcase */

const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');
const mockSessions = require('./mocks/v2/sessions.responses');
const mockPatientPreCheckIns = require('./mocks/v2/patient.pre.check.in.responses');
const mockPreCheckIns = require('./mocks/v2/pre.check.in.responses');

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
  'GET /check_in/v2/pre_check_ins/:uuid': (req, res) => {
    // TODO??: add check for queryString "/pre_check_ins/<uuid>?checkInType=preCheckIn"
    const { uuid } = req.params;
    return res.json(mockPatientPreCheckIns.createMockSuccessResponse(uuid));
  },
  'POST /check_in/v2/pre_check_ins/': (req, res) => {
    const { uuid, checkInType } = req.body?.preCheckIn || {};
    if (!uuid || checkInType !== 'preCheckIn') {
      return res.status(500).json(mockPreCheckIns.createMockFailedResponse());
    } else {
      return res.json(mockPreCheckIns.createMockSuccessResponse({}));
    }
  },
};

module.exports = delay(responses, 2000);
