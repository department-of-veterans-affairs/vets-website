import { addDays, startOfDay, addHours } from 'date-fns';
import { expect } from 'chai';
import MockDate from 'mockdate';

const providerUtil = require('../../utils/provider');

describe('VAOS provider utils', () => {
  afterEach(() => {
    MockDate.reset();
  });
  const tomorrow = addDays(startOfDay(new Date()), 1);
  describe('createProviderDetails', () => {
    const providerObjectTwoSlots = providerUtil.createProviderDetails(2);
    it('Creates a provider with specified number of slots', () => {
      expect(providerObjectTwoSlots.slots.length).to.equal(2);
    });
    it('Creates slots for tomorrow an hour apart starting at 12', () => {
      expect(providerObjectTwoSlots.slots[0].start).to.equal(
        addHours(tomorrow, 12).toISOString(),
      );
      expect(providerObjectTwoSlots.slots[1].start).to.equal(
        addHours(tomorrow, 13).toISOString(),
      );
    });
    it('Creates empty slots array with 0', () => {
      const providerObjectNoSlots = providerUtil.createProviderDetails(0);
      expect(providerObjectNoSlots.slots.length).to.equal(0);
    });
  });
  describe('getAddressString', () => {
    it('Formats the address string', () => {
      expect(
        providerUtil.getAddressString(providerUtil.providers['111'].orgAddress),
      ).to.equal('111 Lori Ln., New York, New York, 10016');
    });
  });
  describe('getSlotByDate', () => {
    it('returns the correct object for a given data', () => {
      const provider = providerUtil.createProviderDetails(2);
      const date = provider.slots[0].start;
      expect(providerUtil.getSlotByDate(provider.slots, date)).to.equal(
        provider.slots[0],
      );
    });
  });
  describe('getSlotById', () => {
    it('returns the correct object for a given id', () => {
      const provider = providerUtil.createProviderDetails(2);
      const { id } = provider.slots[0];
      expect(providerUtil.getSlotById(provider.slots, id)).to.equal(
        provider.slots[0],
      );
    });
  });
  describe('hasConflict', () => {
    MockDate.set('2024-12-05T00:00:00Z');
    const tz = 'America/Los_Angeles';
    const appointmentsByMonth = {
      '2024-12': [
        {
          start: '2024-12-06T09:00:00-08:00',
          timezone: tz,
          minutesDuration: 60,
        },
      ],
    };
    it('returns false when there is no conflict', () => {
      expect(
        providerUtil.hasConflict(
          '2024-12-06T16:00:00Z',
          appointmentsByMonth,
          tz,
        ),
      ).to.be.false;
    });
    it('returns true when there is no conflict', () => {
      expect(
        providerUtil.hasConflict(
          '2024-12-06T17:00:00Z',
          appointmentsByMonth,
          tz,
        ),
      ).to.be.true;
    });
  });
});
