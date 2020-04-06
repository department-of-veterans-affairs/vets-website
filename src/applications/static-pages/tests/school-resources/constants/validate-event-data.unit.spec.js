import moment from 'moment';

import scoEvents from '../../../school-resources/constants/events';

describe('school resources data', () => {
  test('all events have required data', () => {
    scoEvents.forEach(item => {
      expect(typeof item.name).toBe('string');
      expect(typeof item.url).toBe('string');
      expect(typeof item.location).toBe('string');
      expect(typeof item.eventStartDate).toBe('string');
      expect(typeof item.displayStartDate).toBe('string');
      expect(item.name).not.toHaveLength(0);
      expect(item.url).not.toHaveLength(0);
      expect(item.location).not.toHaveLength(0);
      expect(item.eventStartDate).not.toHaveLength(0);
      expect(item.displayStartDate).not.toHaveLength(0);
    });
  });

  test('all date fields are valid dates', () => {
    scoEvents.forEach(item => {
      expect(moment(item.eventStartDate).isValid()).toBe(true);
      expect(moment(item.eventEndDate).isValid()).toBe(true);
      expect(moment(item.displayStartDate).isValid()).toBe(true);
    });
  });
});
