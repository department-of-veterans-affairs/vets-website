/* eslint-disable camelcase */

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const mockCheckIns = require('./mocks/v1/check.in.responses');
const mockPatientCheckIns = require('./mocks/v1/patient.check.in.responses');
const mockSessions = require('./mocks/v1/sessions.responses');

const featureToggles = require('./mocks/feature.toggles');
const delay = require('mocker-api/lib/delay');

let hasBeenValidated = false;

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.createFeatureToggles(
    true,
    true,
    false,
    false,
  ),
  // v0
  'GET /check_in/v0/patient_check_ins/:id': (req, res) => {
    const { id } = req.params;
    return res.json(
      mockPatientCheckIns.createMockSuccessResponse({ id }, true),
    );
  },
  'POST /check_in/v0/patient_check_ins/': (_req, res) => {
    return res.json(mockCheckIns.createMockSuccessResponse({}));
  },
  // v1
  'GET /check_in/v1/sessions/:uuid': (req, res) => {
    return res.json(mockSessions.v1Api.get(req.params));
  },
  'POST /check_in/v1/sessions': (req, res) => {
    const { last4, lastName } = req.body?.session || {};
    if (!last4 || !lastName) {
      return res.status(400).json(mockSessions.createMockFailedResponse());
    }
    hasBeenValidated = true;
    return res.json(mockSessions.v1Api.post(req.body));
  },
  'GET /check_in/v1/patient_check_ins/:uuid': (req, res) => {
    if (hasBeenValidated) {
      hasBeenValidated = false;
      return res.json(mockPatientCheckIns.createMockSuccessResponse({}, true));
    } else {
      return res.json(mockPatientCheckIns.createMockSuccessResponse({}, false));
    }
  },
  'POST /check_in/v1/patient_check_ins/': (_req, res) => {
    // same as v0
    return res.json(mockCheckIns.createMockSuccessResponse({}));
  },
};

module.exports = delay(responses, 2000);
