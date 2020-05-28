import { expect } from 'chai';
import { transformSlots } from '../../../services/slot/transformers';
import { FREE_BUSY_TYPES } from '../../../utils/constants';

const slots = [
  {
    startDateTime: '2020-04-06T14:00:00.000+00:00',
    endDateTime: '2020-04-06T14:20:00.000+00:00',
    bookingStatus: '1',
    remainingAllowedOverBookings: '3',
    availability: true,
  },
];

describe('VAOS Slot transformer', () => {
  describe('transformSlots', () => {
    it('should map freeBusyType to "free"', () => {
      const data = transformSlots(slots, '983');
      expect(data[0].freeBusyType).to.equal(FREE_BUSY_TYPES.free);
    });

    it('should map start time and remove bad offset', () => {
      const data = transformSlots(slots, '983');
      expect(data[0].start).to.equal('2020-04-06T14:00:00.000');
    });

    it('should map end time and remove bad offset', () => {
      const data = transformSlots(slots, '983');
      expect(data[0].end).to.equal('2020-04-06T14:20:00.000');
    });
  });
});
