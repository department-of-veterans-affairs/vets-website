const {
  MockReferralSubmitAppointmentResponse,
} = require('../../../../tests/fixtures/MockReferralSubmitAppointmentResponse');

function submitAppointmentHandler(req, res) {
  const { id, referralNumber, slotId, networkId, providerServiceId } = req.body;

  if (!id || !referralNumber || !slotId || !networkId || !providerServiceId) {
    return res.status(400).json(
      new MockReferralSubmitAppointmentResponse({
        appointmentId: id,
        notFound: true,
      }),
    );
  }

  if (referralNumber === 'appointment-submit-error') {
    return res.status(500).json(
      new MockReferralSubmitAppointmentResponse({
        appointmentId: id,
        serverError: true,
      }),
    );
  }

  global.draftAppointmentPollCount[id] = 1;
  return res.json(
    new MockReferralSubmitAppointmentResponse({
      appointmentId: id,
    }),
  );
}
exports.submitAppointmentHandler = submitAppointmentHandler;
