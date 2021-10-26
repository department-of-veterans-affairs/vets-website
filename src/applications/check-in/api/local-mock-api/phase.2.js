/* eslint-disable camelcase */

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const mockCheckIns = require('./mocks/v1/check.in.responses');
const mockPatientCheckIns = require('./mocks/v1/patient.check.in.responses');
const mockSessions = require('./mocks/v1/sessions.responses');

const featureToggles = require('./mocks/feature.toggles');
const delay = require('mocker-api/lib/delay');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    checkInExperienceMultipleAppointmentSupport: false,
    checkInExperienceUpdateInformationPageEnabled: false,
  }),
  // v1
  'GET /check_in/v1/sessions/:uuid': (req, res) => {
    return res.json(mockSessions.v1Api.get(req.params));
  },
  'POST /check_in/v1/sessions': (req, res) => {
    const { last4, lastName } = req.body?.session || {};
    if (!last4 || !lastName) {
      return res.status(400).json(mockSessions.createMockFailedResponse());
    }
    return res.json(mockSessions.v1Api.post(req.body));
  },
  'GET /check_in/v1/patient_check_ins/:uuid': (req, res) => {
    return res.json(mockPatientCheckIns.createMockSuccessResponse({}, true));
  },
  'POST /check_in/v1/patient_check_ins/': (_req, res) => {
    // same as v0
    return res.json(mockCheckIns.createMockSuccessResponse({}));
  },
};

module.exports = delay(responses, 2000);
