const {
  MockReferralDraftAppointmentResponse,
} = require('../../../../tests/fixtures/MockReferralDraftAppointmentResponse');

function postAppointmentDraftHandler(req, res) {
  const { referral_number: referralNumber } = req.body;
  // empty referral number throws error
  if (referralNumber === '') {
    return res.status(500).json(
      new MockReferralDraftAppointmentResponse({
        referralNumber,
        serverError: true,
      }),
    );
  }
  if (referralNumber === 'draft-no-slots-error') {
    return res.json(
      new MockReferralDraftAppointmentResponse({
        referralNumber,
        categoryOfCare: 'OPTOMETRY',
        startDate: new Date(),
        noSlotsError: true,
      }),
    );
  }

  return res.json(
    new MockReferralDraftAppointmentResponse({
      referralNumber,
      categoryOfCare: 'OPTOMETRY',
      startDate: new Date(),
    }),
  );
}
exports.postAppointmentDraftHandler = postAppointmentDraftHandler;
