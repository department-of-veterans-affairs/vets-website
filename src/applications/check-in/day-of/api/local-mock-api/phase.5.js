/* eslint-disable camelcase */

const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');
const mockCheckIns = require('./mocks/v2/check.in.responses');
const mockPatientCheckIns = require('./mocks/v2/patient.check.in.responses');
const mockSessions = require('./mocks/v2/sessions.responses');

const featureToggles = require('./mocks/feature.toggles');
const delay = require('mocker-api/lib/delay');

let hasBeenValidated = false;

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    checkInExperienceUpdateInformationPageEnabled: false,
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
    hasBeenValidated = true;
    return res.json(mockSessions.mocks.post(req.body));
  },
  'GET /check_in/v2/patient_check_ins/:uuid': (req, res) => {
    const { uuid } = req.params;
    if (hasBeenValidated) {
      hasBeenValidated = false;
      return res.json(mockPatientCheckIns.createMultipleAppointments(uuid, 3));
    } else {
      return res.json(mockPatientCheckIns.createMultipleAppointments(uuid));
    }
  },
  'POST /check_in/v2/patient_check_ins/': (req, res) => {
    const { uuid, appointmentIen, facilityId } =
      req.body?.patientCheckIns || {};
    if (!uuid || !appointmentIen || !facilityId) {
      return res.status(500).json(mockCheckIns.createMockFailedResponse());
    } else {
      return res.json(mockCheckIns.createMockSuccessResponse({}));
    }
  },
};

module.exports = delay(responses, 2000);
