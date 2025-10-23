import { expect } from 'chai';
import MockReferralListResponse from '../../../tests/fixtures/MockReferralListResponse';

const referralUtil = require('../../utils/referrals');

describe('VAOS referral generator', () => {
  describe('createReferralById', () => {
    const referral = referralUtil.createReferralById('2024-10-30', '1')
      .attributes;
    it('Create a referral based on specific date', () => {
      expect(referral.expirationDate).to.equal('2025-04-30');
    });
  });
  describe('getReferralSlotKey', () => {
    expect(referralUtil.getReferralSlotKey('111')).to.equal(
      'selected-slot-referral-111',
    );
  });
  describe('filterReferrals', () => {
    // Create referrals using the fixture
    const optometryReferral = MockReferralListResponse.createReferral({
      id: 'test-optometry',
      categoryOfCare: 'OPTOMETRY',
    });
    const chiropracticReferral = MockReferralListResponse.createReferral({
      id: 'test-chiropractic',
      categoryOfCare: 'CHIROPRACTIC',
    });
    const physicalTherapyReferral = MockReferralListResponse.createReferral({
      id: 'test-physical-therapy',
      categoryOfCare: 'physical-therapy',
    });

    const referrals = [
      physicalTherapyReferral,
      optometryReferral,
      chiropracticReferral,
    ];
    it('Filters out disallowed categories of care', () => {
      const filteredReferrals = referralUtil.filterReferrals(referrals);
      expect(filteredReferrals.length).to.equal(1);
      expect(filteredReferrals[0].attributes.categoryOfCare).to.equal(
        'OPTOMETRY',
      );
    });
    it('Includes chiropractic when feature is enabled', () => {
      const filteredReferrals = referralUtil.filterReferrals(referrals, true);
      expect(filteredReferrals.length).to.equal(2);
      const categories = filteredReferrals.map(
        referral => referral.attributes.categoryOfCare,
      );
      expect(categories).to.include('OPTOMETRY');
      expect(categories).to.include('CHIROPRACTIC');
    });
  });
  describe('getAddressString', () => {
    it('Formats the address string', () => {
      const referral = referralUtil.createReferralById('2024-10-30', '111')
        .attributes;
      expect(
        referralUtil.getAddressString(referral.referringFacility.address),
      ).to.equal('222 Richmond Avenue, BATAVIA, 14020');
    });
  });
});
