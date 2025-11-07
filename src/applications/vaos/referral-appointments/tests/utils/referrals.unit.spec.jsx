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

  describe('getNextAppointment', () => {
    it('Returns null for empty appointment systems', () => {
      expect(referralUtil.getNextAppointment([])).to.be.null;
      expect(referralUtil.getNextAppointment(null)).to.be.null;
    });

    it('Returns null when no appointments are booked', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'cancelled', start: '2025-12-01T10:00:00Z' },
            { id: '2', status: 'pending', start: '2025-12-02T14:00:00Z' },
          ],
        },
      ];
      expect(referralUtil.getNextAppointment(appointmentSystems)).to.be.null;
    });

    it('Returns null when all booked appointments are in the past', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'booked', start: '2024-01-01T10:00:00Z' },
            { id: '2', status: 'booked', start: '2024-06-15T14:00:00Z' },
          ],
        },
      ];
      expect(referralUtil.getNextAppointment(appointmentSystems)).to.be.null;
    });

    it('Returns the earliest future booked appointment from single system', () => {
      const futureDate1 = new Date();
      futureDate1.setDate(futureDate1.getDate() + 5);
      const futureDate2 = new Date();
      futureDate2.setDate(futureDate2.getDate() + 10);

      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '2', status: 'booked', start: futureDate2.toISOString() },
            { id: '1', status: 'booked', start: futureDate1.toISOString() },
          ],
        },
      ];
      const result = referralUtil.getNextAppointment(appointmentSystems);
      expect(result).to.deep.equal({ id: '1', system: 'VAOS' });
    });

    it('Returns the earliest future booked appointment across multiple systems', () => {
      const futureDate1 = new Date();
      futureDate1.setDate(futureDate1.getDate() + 3);
      const futureDate2 = new Date();
      futureDate2.setDate(futureDate2.getDate() + 7);
      const futureDate3 = new Date();
      futureDate3.setDate(futureDate3.getDate() + 1);

      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'booked', start: futureDate1.toISOString() },
            { id: '2', status: 'cancelled', start: futureDate2.toISOString() },
          ],
        },
        {
          system: 'EPS',
          data: [
            { id: '3', status: 'booked', start: futureDate3.toISOString() },
            { id: '4', status: 'booked', start: futureDate2.toISOString() },
          ],
        },
      ];
      const result = referralUtil.getNextAppointment(appointmentSystems);
      expect(result).to.deep.equal({ id: '3', system: 'EPS' });
    });

    it('Handles invalid dates gracefully', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'booked', start: 'invalid-date' },
            { id: '2', status: 'booked', start: futureDate.toISOString() },
          ],
        },
      ];
      const result = referralUtil.getNextAppointment(appointmentSystems);
      expect(result).to.deep.equal({ id: '2', system: 'VAOS' });
    });

    it('Handles missing start dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'booked' }, // No start date
            { id: '2', status: 'booked', start: futureDate.toISOString() },
          ],
        },
      ];
      const result = referralUtil.getNextAppointment(appointmentSystems);
      expect(result).to.deep.equal({ id: '2', system: 'VAOS' });
    });
  });

  describe('canBeScheduled', () => {
    it('Returns false for missing or null appointment systems (conservative approach)', () => {
      expect(referralUtil.canBeScheduled([])).to.be.false;
      expect(referralUtil.canBeScheduled(null)).to.be.false;
    });

    it('Returns false when data is missing or null (conservative approach)', () => {
      const appointmentSystems = [
        { system: 'VAOS', data: null },
        { system: 'EPS' }, // No data property
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.false;
    });

    it('Returns true when no appointments exist (empty arrays allow scheduling)', () => {
      const appointmentSystems = [
        { system: 'VAOS', data: [] },
        { system: 'EPS', data: [] },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.true;
    });

    it('Returns true when all appointments are cancelled (allows rescheduling)', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'cancelled', start: '2025-12-01T10:00:00Z' },
          ],
        },
        {
          system: 'EPS',
          data: [
            { id: '2', status: 'cancelled', start: '2025-12-02T14:00:00Z' },
          ],
        },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.true;
    });

    it('Returns false when there are non-cancelled appointments in VAOS', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'booked', start: '2025-12-01T10:00:00Z' },
            { id: '2', status: 'cancelled', start: '2025-12-02T14:00:00Z' },
          ],
        },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.false;
    });

    it('Returns false when there are non-cancelled appointments in EPS', () => {
      const appointmentSystems = [
        {
          system: 'EPS',
          data: [{ id: '1', status: 'pending', start: '2025-12-01T10:00:00Z' }],
        },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.false;
    });

    it('Returns false when there are non-cancelled appointments in any system', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'cancelled', start: '2025-12-01T10:00:00Z' },
          ],
        },
        {
          system: 'EPS',
          data: [{ id: '2', status: 'booked', start: '2025-12-02T14:00:00Z' }],
        },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.false;
    });

    it('Returns false when appointments have various non-cancelled statuses', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'pending', start: '2025-12-01T10:00:00Z' },
            { id: '2', status: 'booked', start: '2025-12-02T14:00:00Z' },
            { id: '3', status: 'confirmed', start: '2025-12-03T16:00:00Z' },
          ],
        },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.false;
    });

    it('Returns false when appointments have missing required data', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', start: '2025-12-01T10:00:00Z' }, // No status
            { id: '2', status: 'cancelled', start: '2025-12-02T14:00:00Z' },
            { status: 'booked', start: '2025-12-03T10:00:00Z' }, // No id
            { id: '4', status: 'booked' }, // No start
          ],
        },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.false;
    });

    it('Returns false when appointments have invalid start dates', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'booked', start: 'invalid-date' },
            { id: '2', status: 'booked', start: '2025-13-45T99:99:99Z' },
          ],
        },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.false;
    });

    it('Returns false when there are active appointments even with cancelled ones', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [
            { id: '1', status: 'booked', start: '2025-12-01T10:00:00Z' },
            { id: '2', status: 'cancelled', start: '2025-12-02T14:00:00Z' }, // Cancelled but has active appointment too
          ],
        },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.false;
    });

    it('Returns true when one system is empty and other has only cancelled appointments', () => {
      const appointmentSystems = [
        {
          system: 'VAOS',
          data: [],
        },
        {
          system: 'EPS',
          data: [
            { id: '1', status: 'cancelled', start: '2025-12-01T10:00:00Z' },
          ],
        },
      ];
      expect(referralUtil.canBeScheduled(appointmentSystems)).to.be.true;
    });
  });
});
