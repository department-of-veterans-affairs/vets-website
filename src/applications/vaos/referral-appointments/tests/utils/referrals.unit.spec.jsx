import { expect } from 'chai';

const referralUtil = require('../../utils/referrals');

describe('VAOS referral generator', () => {
  describe('createReferralById', () => {
    const referral = referralUtil.createReferralById('1', '2024-10-30')
      .attributes;
    it('Create a referral based on specific date', () => {
      expect(referral.expirationDate).to.equal('2024-10-30');
    });
  });
  describe('createReferrals', () => {
    it('Create specified number of referrals', () => {
      const referrals = referralUtil.createReferrals(2);
      expect(referrals.length).to.equal(2);
    });
    it('Creates each referral on day later', () => {
      const referrals = referralUtil.createReferrals(2, '2025-10-11');
      expect(referrals[0].attributes.expirationDate).to.equal('2026-04-11');
      expect(referrals[1].attributes.expirationDate).to.equal('2026-04-12');
    });
  });
  describe('getReferralSlotKey', () => {
    expect(referralUtil.getReferralSlotKey('111')).to.equal(
      'selected-slot-referral-111',
    );
  });
  describe('filterReferrals', () => {
    let referrals = referralUtil.createReferrals(1);
    const nonPhysicalTherapyReferral = referralUtil.createReferralById(
      'uid',
      null,
      'non-physical-therapy',
    );
    referrals = [nonPhysicalTherapyReferral, ...referrals];

    it('Filters out non-physical therapy referrals', () => {
      const filteredReferrals = referralUtil.filterReferrals(referrals);
      expect(filteredReferrals.length).to.equal(1);
      expect(filteredReferrals[0].attributes.categoryOfCare).to.equal(
        'Physical Therapy',
      );
    });
  });
  describe('getAddressString', () => {
    it('Formats the address string', () => {
      const referral = referralUtil.createReferralById('111').attributes;
      expect(
        referralUtil.getAddressString(referral.referringFacilityInfo.address),
      ).to.equal('222 Richmond Avenue, BATAVIA, NY, 14020');
    });
  });
});
