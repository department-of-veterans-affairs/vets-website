/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const checkInData = require('./mocks/v2/check-in-data/index');
const preCheckInData = require('./mocks/v2/pre-check-in-data/index');
const sessions = require('./mocks/v2/sessions/index');

const featureToggles = require('./mocks/v2/feature-toggles/index');

let hasBeenValidated = false;
const mockUser = Object.freeze({
  lastName: 'Smith',
  last4: '1234',
  dob: '1989-03-15',
});

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    checkInExperienceEnabled: true,
    preCheckInEnabled: true,
  }),
  // v2
  'GET /check_in/v2/sessions/:uuid': (req, res) => {
    return res.json(sessions.get.createMockSuccessResponse(req.params));
  },
  'POST /check_in/v2/sessions': (req, res) => {
    if (req.body?.session.dob) {
      const { lastName, dob } = req.body?.session || {};
      if (!lastName) {
        return res.status(400).json(sessions.post.createMockFailedResponse());
      }
      if (dob !== mockUser.dob || lastName !== mockUser.lastName) {
        return res
          .status(400)
          .json(sessions.post.createMockValidateErrorResponse());
      }
      hasBeenValidated = true;
      return res.json(sessions.post.createMockSuccessResponse(req.body));
    }

    const { last4, lastName } = req.body?.session || {};
    if (!last4 || !lastName) {
      return res.status(400).json(sessions.post.createMockFailedResponse());
    }
    if (last4 !== mockUser.last4 || lastName !== mockUser.lastName) {
      return res
        .status(400)
        .json(sessions.post.createMockValidateErrorResponse());
    }
    hasBeenValidated = true;
    return res.json(sessions.post.createMockSuccessResponse(req.body));
  },
  'GET /check_in/v2/patient_check_ins/:uuid': (req, res) => {
    const { uuid } = req.params;
    if (hasBeenValidated) {
      hasBeenValidated = false;
      return res.json(checkInData.get.createMultipleAppointments(uuid, 3));
    }
    return res.json(checkInData.get.createMultipleAppointments(uuid));
  },
  'POST /check_in/v2/patient_check_ins/': (req, res) => {
    const { uuid, appointmentIen, facilityId } =
      req.body?.patientCheckIns || {};
    if (!uuid || !appointmentIen || !facilityId) {
      return res.status(500).json(checkInData.post.createMockFailedResponse());
    }
    return res.json(checkInData.post.createMockSuccessResponse({}));
  },
  'GET /check_in/v2/pre_check_ins/:uuid': (req, res) => {
    // TODO??: add check for queryString "/pre_check_ins/<uuid>?checkInType=preCheckIn"
    const { uuid } = req.params;
    return res.json(preCheckInData.get.createMockSuccessResponse(uuid));
  },
  'POST /check_in/v2/pre_check_ins/': (req, res) => {
    const { uuid, checkInType } = req.body?.preCheckIn || {};
    if (!uuid || checkInType !== 'preCheckIn') {
      return res
        .status(500)
        .json(preCheckInData.post.createMockFailedResponse());
    }
    return res.json(preCheckInData.post.createMockSuccessResponse({}));
  },
  'POST /check_in/v2/edit_demographics/': (req, res) => {
    return res.json(checkInData.post.createMockEditSuccessResponse({}));
  },
  'PATCH /check_in/v2/demographics/:uuid': (req, res) => {
    const { uuid } = req.params;
    if (!uuid) {
      return res.status(400).json(checkInData.patch.createMockFailedResponse());
    }
    return res.json(checkInData.post.createMockSuccessResponse({}));
  },
};

module.exports = delay(responses, 2000);
