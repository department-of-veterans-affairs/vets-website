import moment from 'moment';

import announcements from '../../../school-resources/constants/announcements';

describe('Announcements data', () => {
  test('has all required fields', () => {
    announcements.forEach(announcement => {
      expect(typeof announcement.name).toBe('string');
      expect(typeof announcement.date).toBe('string');
      expect(typeof announcement.displayStartDate).toBe('string');
      expect(announcement.name).not.toHaveLength(0);
      expect(announcement.date).not.toHaveLength(0);
      expect(announcement.displayStartDate).not.toHaveLength(0);
    });
  });

  test('all date fields are valid dates', () => {
    announcements.forEach(announcement => {
      expect(moment(announcement.date).isValid()).toBe(true);
      expect(moment(announcement.displayStartDate).isValid()).toBe(true);
    });
  });
});
