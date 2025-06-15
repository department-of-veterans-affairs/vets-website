import { expect } from 'chai';
import moment from 'moment';

import announcements from '../../constants/announcements';

describe('Announcements data', () => {
  it('has all required fields', () => {
    announcements.forEach(announcement => {
      expect(announcement.name).to.be.a('string');
      expect(announcement.date).to.be.a('string');
      expect(announcement.displayStartDate).to.be.a('string');
      expect(announcement.name).to.not.be.empty;
      expect(announcement.date).to.not.be.empty;
      expect(announcement.displayStartDate).to.not.be.empty;
    });
  });

  it('all date fields are valid dates', () => {
    announcements.forEach(announcement => {
      expect(moment(announcement.date).isValid()).to.eq(true);
      expect(moment(announcement.displayStartDate).isValid()).to.eq(true);
    });
  });
});
