import { expect } from 'chai';

import slots from '../../../api/slots.json';
import { transformSlots } from '../../../services/slot/transformers';

const slotsParsed = slots.data.map(f => ({
  ...f.attributes,
  id: f.id,
}));

describe('VAOS Slot transformer', () => {
  describe('transformSlots', () => {
    it('should map status to "free"', () => {
      const data = transformSlots(slotsParsed);
      expect(data[0].status).to.equal('free');
    });

    it('should map start time', () => {
      const data = transformSlots(slotsParsed);
      expect(data.start).to.equal(slotsParsed[0].startDateTime);
    });

    it('should map end end', () => {
      const data = transformSlots(slotsParsed);
      expect(data.end).to.equal(slotsParsed[0].endDateTime);
    });
  });
});
