import { format } from 'date-fns';
import { expect } from 'chai';

const referralUtil = require('../../utils/referrals');

describe('VAOS referral generator', () => {
  const today = format(new Date(), 'yyyy-MM-dd kk:mm:ss');
  describe('createReferral', () => {
    const referral = referralUtil.createReferral(today, '1');
    it('Create a referral based on specific date', () => {
      expect(referral.ReferralDate).to.equal(
        format(new Date(today), 'yyyy-MM-dd'),
      );
    });
  });
  describe('createReferrals', () => {
    it('Create specified number of referrals', () => {
      const referrals = referralUtil.createReferrals(2, today);
      expect(referrals.length).to.equal(2);
    });
    it('Creates each referral on day later', () => {
      const referrals = referralUtil.createReferrals(2, '2024-10-30T07:24:00');
      expect(referrals[0].ReferralDate).to.equal('2024-10-30');
      expect(referrals[1].ReferralDate).to.equal('2024-10-31');
    });
  });
});
