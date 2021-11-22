import { expect } from 'chai';

import { TITLES } from '../../../config/utils';

describe('health care questionnaire -- utils -- titles are correct', () => {
  it('2 titles are defined. ', () => {
    expect(Object.keys(TITLES).length).to.equal(2);
  });
  it('Check demographics title', () => {
    expect(TITLES.demographics).to.equal('Veteran information');
  });
  it('Check reason for visit title', () => {
    expect(TITLES.reasonForVisit).to.equal('Prepare for your appointment');
  });
});
