import { expect } from 'chai';

import { isValidDate } from '../validations';

describe('isValidDate', () => {
  it('should detect valid dates', () => {
    expect(isValidDate(new Date())).to.be.true;
    expect(isValidDate(new Date('2020-01-01'))).to.be.true;
    expect(isValidDate(new Date(946684800000))).to.be.true;
  });
  it('should detect invalid dates', () => {
    expect(isValidDate({})).to.be.false;
    expect(isValidDate(12345)).to.be.false;
    expect(isValidDate(Date)).to.be.false;
    expect(isValidDate(new Date('xyz'))).to.be.false;
    expect(isValidDate(new Date(Infinity))).to.be.false;
  });
});
