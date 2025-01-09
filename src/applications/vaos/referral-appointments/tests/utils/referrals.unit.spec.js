import { format } from 'date-fns';
import { expect } from 'chai';

const referralUtil = require('../../utils/referrals');

describe('VAOS referral generator', () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  describe('createReferral', () => {
    const referral = referralUtil.createReferral(today, '1');
    it('Create a referral based on specific date', () => {
      expect(referral.ReferralDate).to.equal(today);
    });
  });
  describe('createReferrals', () => {
    it('Create specified number of referrals', () => {
      const referrals = referralUtil.createReferrals(2, today);
      expect(referrals.length).to.equal(2);
    });
    it('Creates each referral on day later', () => {
      const referrals = referralUtil.createReferrals(2, '2024-10-30');
      expect(referrals[0].ReferralDate).to.equal('2024-10-30');
      expect(referrals[1].ReferralDate).to.equal('2024-10-31');
    });
  });
  describe('getReferralSlotKey', () => {
    expect(referralUtil.getReferralSlotKey('111')).to.equal(
      'selected-slot-referral-111',
    );
  });
  describe('filterReferrals', () => {
    const nonPhysicalTherapyReferral = referralUtil.createReferral(
      today,
      'uid',
      '333',
    );
    const physicalTherapyReferral = referralUtil.createReferral(
      today,
      'uid-2',
      '111',
    );
    const referrals = [nonPhysicalTherapyReferral, physicalTherapyReferral];

    it('Filters out non-physical therapy referrals', () => {
      const filteredReferrals = referralUtil.filterReferrals(referrals);
      expect(filteredReferrals.length).to.equal(1);
      expect(filteredReferrals[0].UUID).to.equal('uid-2');
    });
  });
});
