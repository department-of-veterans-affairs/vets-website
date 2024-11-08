import { addDays, startOfDay, addHours } from 'date-fns';
import { expect } from 'chai';

const providerUtil = require('../../utils/provider');

describe('VAOS provider generator', () => {
  const tomorrow = addDays(startOfDay(new Date()), 1);
  describe('createProviderDetails', () => {
    const providerObjectTwoSlots = providerUtil.createProviderDetails(2);
    const providerObjectNoSlots = providerUtil.createProviderDetails(0);
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
      expect(providerObjectNoSlots.slots.length).to.equal(0);
    });
  });
});
