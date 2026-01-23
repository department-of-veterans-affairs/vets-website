const {
  MockReferralAppointmentDetailsResponse,
} = require('../../../../tests/fixtures/MockReferralAppointmentDetailsResponse');

function getEpsAppointmentHandler(req, res) {
  let successPollCount = 2; // The number of times to poll before returning a confirmed appointment
  const { appointmentId } = req.params;

  // create a mock appointment in draft state for polling simulation
  let mockAppointment = new MockReferralAppointmentDetailsResponse({
    appointmentId,
    status: 'draft',
  });

  const mockBookedAppointment = new MockReferralAppointmentDetailsResponse({
    appointmentId,
    status: 'booked',
  });

  const serverError = new MockReferralAppointmentDetailsResponse({
    appointmentId,
    serverError: true,
  });

  const notFoundError = new MockReferralAppointmentDetailsResponse({
    appointmentId,
    notFound: true,
  });

  if (appointmentId === 'appointment-for-poll-retry-error') {
    // Set a very high poll count to simulate a timeout
    successPollCount = 1000;
  }

  if (appointmentId === 'appointment-for-poll-error') {
    return res.status(500).json(serverError);
  }

  // Check if the request is coming = require(the details page
  const isDetailsView = req.headers['x-page-type'] === 'details'; // 'details' or 'review-confirm'

  if (
    isDetailsView &&
    appointmentId === 'appointment-for-details-not-found-error'
  ) {
    return res.status(400).json(notFoundError);
  }

  if (isDetailsView && appointmentId === 'appointment-for-details-error') {
    return res.status(500).json(serverError);
  }

  if (isDetailsView) {
    // For details view, immediately return appointment in booked state
    return res.json(mockBookedAppointment);
  }

  // Continue with normal polling behavior for ReviewAndConfirm component
  const count = global.draftAppointmentPollCount[appointmentId] || 0;

  // Mock polling for appointment state change
  if (count < successPollCount) {
    global.draftAppointmentPollCount[appointmentId] = count + 1;
  } else {
    // reassign status of mocked appointment to booked to simulate success
    global.draftAppointmentPollCount[appointmentId] = 0;
    mockAppointment = new MockReferralAppointmentDetailsResponse({
      appointmentId,
      status: 'booked',
    });
  }

  return res.json(mockAppointment);
}
exports.getEpsAppointmentHandler = getEpsAppointmentHandler;
