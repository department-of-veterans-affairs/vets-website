import scoEvents from '../../school-resources/constants/events';
import { expect } from 'chai';

describe('school resources data', () => {
  it('should contain only valid events', () => {
    scoEvents.forEach(item => {
      expect(item.name).to.not.eq(null);
      expect(item.url).to.not.eq(null);
      expect(item.location).to.not.eq(null);
      expect(item.eventStartDate).to.not.eq(null);
      expect(item.displayStartDate).to.not.eq(null);
    });
  });
});
