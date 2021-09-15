/* eslint-disable camelcase */

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const mockCheckIns = require('./mocks/check.in.response');
const mockValidates = require('./mocks/validate.responses');
const mockPatientCheckIns = require('./mocks/patient.check.in.response');
const featureToggles = require('./mocks/feature.toggles');
const sessions = require('./mocks/sessions.responses');
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
    return res.json(mockValidates.createMockSuccessResponse({ id }));
  },
  'POST /check_in/v0/patient_check_ins/': (_req, res) => {
    return res.json(mockCheckIns.createMockSuccessResponse({}));
  },
  // v1
  'GET /check_in/v1/sessions/:uuid': (req, res) => {
    return res.json(sessions.v1Api.get(req.params));
  },
  'POST /check_in/v1/sessions': (req, res) => {
    hasBeenValidated = true;
    return res.json(sessions.v1Api.post(req.body));
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
