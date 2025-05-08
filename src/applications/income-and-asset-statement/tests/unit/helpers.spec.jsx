import { expect } from 'chai';
import { formatFullNameNoSuffix, isDefined } from '../../helpers';

describe('formatFullNameNoSuffix', () => {
  it('should format full name with middle initial', () => {
    const name = { first: 'john', middle: 'michael', last: 'doe' };
    expect(formatFullNameNoSuffix(name)).to.equal('John M. Doe');
  });

  it('should format full name without middle name', () => {
    const name = { first: 'jane', last: 'smith' };
    expect(formatFullNameNoSuffix(name)).to.equal('Jane Smith');
  });

  it('should capitalize all name parts and initialize middle name', () => {
    const name = { first: 'aLIce', middle: 'bEth', last: 'JOHNSON' };
    expect(formatFullNameNoSuffix(name)).to.equal('Alice B. Johnson');
  });

  it('should return empty string if first name is missing', () => {
    const name = { middle: 'ray', last: 'lewis' };
    expect(formatFullNameNoSuffix(name)).to.equal('');
  });

  it('should return empty string if last name is missing', () => {
    const name = { first: 'ray', middle: 'e', last: '' };
    expect(formatFullNameNoSuffix(name)).to.equal('');
  });

  it('should return empty string if name is null', () => {
    expect(formatFullNameNoSuffix(null)).to.equal('');
  });

  it('should return empty string if name is undefined', () => {
    expect(formatFullNameNoSuffix(undefined)).to.equal('');
  });

  it('should handle middle initial with whitespace', () => {
    const name = { first: 'luke', middle: ' ', last: 'skywalker' };
    expect(formatFullNameNoSuffix(name)).to.equal('Luke Skywalker');
  });
});

describe('isDefined', () => {
  it('should return false for undefined', () => {
    expect(isDefined(undefined)).to.be.false;
  });

  it('should return false for null', () => {
    expect(isDefined(null)).to.be.false;
  });

  it('should return false for empty string', () => {
    expect(isDefined('')).to.be.false;
  });

  it('should return true for non-empty string', () => {
    expect(isDefined('hello')).to.be.true;
  });

  it('should return true for number 0', () => {
    expect(isDefined(0)).to.be.true;
  });

  it('should return true for false boolean', () => {
    expect(isDefined(false)).to.be.true;
  });

  it('should return true for true boolean', () => {
    expect(isDefined(true)).to.be.true;
  });

  it('should return true for empty object', () => {
    expect(isDefined({})).to.be.true;
  });

  it('should return true for empty array', () => {
    expect(isDefined([])).to.be.true;
  });
});
