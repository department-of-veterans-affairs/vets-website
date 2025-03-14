/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');
const dateFns = require('date-fns');
const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const checkInData = require('./mocks/v2/check-in-data/index');
const preCheckInData = require('./mocks/v2/pre-check-in-data/index');
const sharedData = require('./mocks/v2/shared/index');
const sessions = require('./mocks/v2/sessions/index');
const btsss = require('./mocks/v2/btsss/index');

const featureToggles = require('./mocks/v2/feature-toggles/index');

let hasBeenValidated = false;
const mockUser = Object.freeze({
  lastName: 'Smith',
  dob: '1935-04-07',
});
const missingUUID = 'a5895713-ca42-4244-9f38-f8b5db020d04';

const demographicsConfirmedUUID = '3f93c0e0-319a-4642-91b3-750e0aec0388';

const upcomingAppointmentsDataGetErrorUUID =
  'b5895713-ca42-4244-9f38-f8b5db020d04';

const noUpcomingAppointmentsUUID = `34de41ed-014c-4734-a4a4-3a4738f5e0d8`;

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    checkInExperienceEnabled: true,
    preCheckInEnabled: true,
  }),
  // v2
  'GET /check_in/v2/sessions/:uuid': (req, res) => {
    const { uuid } = req.params;
    if (uuid === missingUUID) {
      return res
        .status(404)
        .json(sessions.post.createMockMissingUuidErrorResponse());
    }
    return res.json(sessions.get.createMockSuccessResponse(req.params));
  },
  'POST /check_in/v2/sessions': (req, res) => {
    const { lastName, dob } = req.body?.session || {};
    if (req.body?.session.uuid === missingUUID) {
      return res
        .status(404)
        .json(sessions.post.createMockMissingUuidErrorResponse());
    }
    if (!lastName) {
      return res.status(400).json(sharedData.post.createMockFailedResponse());
    }
    if (dob !== mockUser.dob || lastName !== mockUser.lastName) {
      return res
        .status(400)
        .json(sessions.post.createMockValidateErrorResponse());
    }
    hasBeenValidated = true;
    return res.json(sessions.post.createMockSuccessResponse(req.body));
  },
  'GET /check_in/v2/patient_check_ins/:uuid': (req, res) => {
    const { uuid } = req.params;
    const { facilityType } = req.query;
    if (facilityType === 'oh') {
      return res.json(sharedData.get.createAppointmentsOH(uuid));
    }
    if (uuid === demographicsConfirmedUUID) {
      const yesterday = dateFns.sub(new Date(), { days: -1 }).toISOString();
      return res.json(
        sharedData.get.createAppointments(
          uuid,
          false,
          yesterday,
          false,
          yesterday,
          false,
          yesterday,
        ),
      );
    }
    if (hasBeenValidated) {
      hasBeenValidated = false;
      return res.json(sharedData.get.createAppointments(uuid));
    }
    return res.json(sharedData.get.createAppointments(uuid));
  },
  'POST /check_in/v2/patient_check_ins/': (req, res) => {
    const { uuid, appointmentIen } = req.body?.patientCheckIns || {};
    if (!uuid || !appointmentIen) {
      return res.status(500).json(sharedData.post.createMockFailedResponse());
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
      return res.status(500).json(sharedData.post.createMockFailedResponse());
    }
    return res.json(preCheckInData.post.createMockSuccessResponse({}));
  },
  'PATCH /check_in/v2/demographics/:uuid': (req, res) => {
    const { uuid } = req.params;
    if (!uuid) {
      return res.status(400).json(sharedData.patch.createMockFailedResponse());
    }
    return res.json(checkInData.patch.createMockSuccessResponse({}));
  },
  'POST /check_in/v0/travel_claims/': (req, res) => {
    const { uuid, appointmentDate } = req.body?.travelClaims || {};
    if (!uuid || !appointmentDate) {
      return res.status(500).json(btsss.post.createMockFailedResponse());
    }
    return res.status(202).json(btsss.post.createMockSuccessResponse({}));
  },
  'GET /check_in/v2/sessions/:uuid/appointments': (req, res) => {
    const { uuid } = req.params;
    if (hasBeenValidated) {
      hasBeenValidated = false;
      return res.json(sharedData.get.createUpcomingAppointments(uuid));
    }
    if (uuid === upcomingAppointmentsDataGetErrorUUID) {
      return res.status(404).json(sharedData.get.createMockFailedResponse());
    }
    if (uuid === noUpcomingAppointmentsUUID) {
      return res.json({ data: [] });
    }
    return res.json(sharedData.get.createUpcomingAppointments(uuid));
  },
};

module.exports = delay(responses, 2000);
