import { expect } from 'chai';
import { coerceStringValue, addLeadingZero } from '../../utils';

describe('coerceStringValue', () => {
  it('should return the string when value is a string', () => {
    expect(coerceStringValue('hello')).to.equal('hello');
    expect(coerceStringValue('123')).to.equal('123');
    expect(coerceStringValue('')).to.equal('');
    expect(coerceStringValue('test value')).to.equal('test value');
  });

  it('should return empty string when value is null, undefined, or otherwise not a string', () => {
    expect(coerceStringValue(null)).to.equal('');
    expect(coerceStringValue(undefined)).to.equal('');
    expect(coerceStringValue()).to.equal('');
    expect(coerceStringValue(true)).to.equal('');
    expect(coerceStringValue({})).to.equal('');
    expect(coerceStringValue([])).to.equal('');
    expect(coerceStringValue(123)).to.equal('');
  });
});

describe('addLeadingZero', () => {
  it('should add leading zero to single digit numbers', () => {
    expect(addLeadingZero('1')).to.equal('01');
  });

  it('should not add leading zero to two digit numbers', () => {
    expect(addLeadingZero('10')).to.equal('10');
  });

  it('should handle numbers passed as numbers', () => {
    expect(addLeadingZero(1)).to.equal('01');
    expect(addLeadingZero(5)).to.equal('05');
    expect(addLeadingZero(10)).to.equal('10');
  });

  it('should handle zero', () => {
    expect(addLeadingZero('0')).to.equal('00');
    expect(addLeadingZero(0)).to.equal('00');
  });

  it('should properly handle unexpected values', () => {
    expect(addLeadingZero('')).to.equal('00');
    expect(addLeadingZero(null)).to.equal('00');
    expect(addLeadingZero(undefined)).to.equal('00');
  });

  it('should handle three or more digits by taking last two', () => {
    expect(addLeadingZero('100')).to.equal('00');
    expect(addLeadingZero('123')).to.equal('23');
    expect(addLeadingZero('999')).to.equal('99');
  });
});
