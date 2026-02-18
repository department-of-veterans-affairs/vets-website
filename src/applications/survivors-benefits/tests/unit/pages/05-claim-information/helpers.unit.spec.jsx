import { expect } from 'chai';
import { isYes } from '../../../../utils/helpers';

describe('isYes', () => {
  it('should return true for boolean true', () => {
    expect(isYes(true)).to.be.true;
  });
  it('should return true for string "yes"', () => {
    expect(isYes('yes')).to.be.true;
  });
  it('should return false for boolean false', () => {
    expect(isYes(false)).to.be.false;
  });
  it('should return false for string "no"', () => {
    expect(isYes('no')).to.be.false;
  });
});
