import { expect } from 'chai';
import moment from 'moment';

import scoEvents from '../../constants/events';

describe('school resources data', () => {
  it('all events have required data', () => {
    scoEvents.forEach(item => {
      expect(item.name).to.be.a('string');
      expect(item.url).to.be.a('string');
      expect(item.location).to.be.a('string');
      expect(item.eventStartDate).to.be.a('string');
      expect(item.displayStartDate).to.be.a('string');
      expect(item.name).to.not.be.empty;
      expect(item.url).to.not.be.empty;
      expect(item.location).to.not.be.empty;
      expect(item.eventStartDate).to.not.be.empty;
      expect(item.displayStartDate).to.not.be.empty;
    });
  });

  it('all date fields are valid dates', () => {
    scoEvents.forEach(item => {
      expect(moment(item.eventStartDate).isValid()).to.eq(true);
      expect(moment(item.eventEndDate).isValid()).to.eq(true);
      expect(moment(item.displayStartDate).isValid()).to.eq(true);
    });
  });
});
