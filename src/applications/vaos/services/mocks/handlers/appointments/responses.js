const requests = require('../../v2/requests.json');
const requestsOh = require('../../v2/requests_oh.json');
// Returns the meta object without any backend service errors
const submitAppointmentHandler = require('./submitAppointmentHandler');
const { putAppointmentHandler } = require('./putAppointmentHandler');
const { getAppointmentHandler } = require('./getAppointmentHandler');
const { getAppointmentsHandler } = require('./getAppointmentsHandler');
const {
  postAppointmentDraftHandler,
} = require('./postAppointmentDraftHandler');
const { getEpsAppointmentHandler } = require('./getEpsAppointmentHandler');
const { postAppointmentHandler } = require('./postAppointmentHandler');
// Uncomment to produce backend service errors
// const meta = require('./v2/meta_failures.json';

const MockAppointmentRequestResponse = {
  data: requests.data.concat(requestsOh.data),
};
exports.MockAppointmentRequestResponse = MockAppointmentRequestResponse;

global.database = [];
global.draftAppointmentPollCount = {};
global.currentMockId = 1;

const responses = {
  'POST /vaos/v2/appointments': postAppointmentHandler,
  'PUT /vaos/v2/appointments/:id': putAppointmentHandler,
  'GET /vaos/v2/appointments': getAppointmentsHandler,
  'GET /vaos/v2/appointments/:id': getAppointmentHandler,
  'POST /vaos/v2/appointments/draft': postAppointmentDraftHandler,
  'GET /vaos/v2/eps_appointments/:appointmentId': getEpsAppointmentHandler,
  'POST /vaos/v2/appointments/submit': submitAppointmentHandler,
};
module.exports = responses;
