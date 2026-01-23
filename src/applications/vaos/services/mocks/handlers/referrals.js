const MockReferralDetailResponse = require('../../../tests/fixtures/MockReferralDetailResponse');
const MockReferralListResponse = require('../../../tests/fixtures/MockReferralListResponse');

const responses = {
  'GET /vaos/v2/referrals': (req, res) => {
    return res.json(
      new MockReferralListResponse({
        predefined: true,
      }),
    );
  },
  'GET /vaos/v2/referrals/:referralId': (req, res) => {
    if (req.params.referralId === 'error') {
      return res.status(500).json({ error: true });
    }

    if (req.params.referralId === 'scheduled-referral') {
      return res.json(
        new MockReferralDetailResponse({
          id: req.params.referralId,
          expirationDate: '2024-12-02',
          hasAppointments: true,
        }),
      );
    }

    if (req.params.referralId === 'referral-without-provider-error') {
      return res.json(
        new MockReferralDetailResponse({
          id: req.params.referralId,
          provider: null,
        }),
      );
    }

    return res.json(
      new MockReferralDetailResponse({
        id: req.params.referralId,
        referralNumber: req.params.referralId,
      }),
    );
  },
};
module.exports = responses;
