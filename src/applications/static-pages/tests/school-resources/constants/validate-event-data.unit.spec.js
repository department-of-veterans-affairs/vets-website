import { expect } from 'chai';
import moment from 'moment';

import scoEvents from '../../../school-resources/constants/events';

describe('school resources data', () => {
  it('all events have required data', () => {
    scoEvents.forEach(item => {
      expect(item.name).to.be.a('string');
      expect(item.url).to.be.a('string');
      expect(item.location).to.be.a('string');
      expect(item.eventStartDate).to.be.a('string');
      expect(item.displayStartDate).to.be.a('string');
    });
  });

  it('all date fields are valid dates', () => {
    scoEvents.forEach(item => {
      expect(moment(item.eventStartDate).isValid()).to.eq(true);
      expect(moment(item.eventEndDate).isValid()).to.eq(true);
      expect(moment(item.displayStartDate).isValid()).to.eq(true);
      expect(moment(item.displayEndDate).isValid()).to.eq(true);
    });
  });
});
