import { expect } from 'chai';

import checkRedirect from '../../utils/redirect';

describe('checkRedirect', () => {
  it('should return false for pages before part 3 questions', () => {
    expect(checkRedirect('/veteran-details')).to.be.false;
    expect(checkRedirect('/homeless')).to.be.false;
    expect(checkRedirect('/contact-information')).to.be.false;
    expect(checkRedirect('/filing-deadlines')).to.be.false;
  });
  it('should return true for pages not before part 3 questions', () => {
    expect(checkRedirect('/blah')).to.be.true;
    expect(checkRedirect('/contestable-issues')).to.be.true;
  });
});
