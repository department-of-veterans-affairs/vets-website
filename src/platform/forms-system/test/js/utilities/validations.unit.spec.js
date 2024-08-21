import { expect } from 'chai';

import {
  getValidationErrors,
  isValidCurrentOrPastMonthYear,
} from '../../../src/js/utilities/validations';

describe('getValidationErrors', () => {
  // simple validation functions
  const check1 = (errors, data) => {
    if (!data.foo) {
      errors.addError('no foo');
    }
  };
  const check2 = (errors, data) => {
    if (!data.bar) {
      errors.addError('no bar');
    }
  };
  it('should return error messages', () => {
    expect(getValidationErrors([check1])).to.deep.equal(['no foo']);
    expect(getValidationErrors([check1], { bar: '' })).to.deep.equal([
      'no foo',
    ]);
    expect(
      getValidationErrors([check1, check2], { foo: null, bar: null }),
    ).to.deep.equal(['no foo', 'no bar']);
  });
  it('should not return any error messages', () => {
    expect(getValidationErrors([check1], { foo: 'yes' })).to.deep.equal([]);
    expect(getValidationErrors([check2], { bar: 'maybe' })).to.deep.equal([]);
    expect(
      getValidationErrors([check1, check2], { foo: '123', bar: '456' }),
    ).to.deep.equal([]);
  });
});

describe('validations', () => {
  it('isValidCurrentOrPastMonthYear', () => {
    expect(isValidCurrentOrPastMonthYear('10', '2000')).to.be.true;
    expect(isValidCurrentOrPastMonthYear('10', '3000')).to.be.false;
    expect(isValidCurrentOrPastMonthYear('0', '3000')).to.be.false;
    const today = new Date();
    const todaysMonth = today.getMonth() + 1; // 0 based index
    const todaysYear = today.getFullYear();
    expect(isValidCurrentOrPastMonthYear(todaysMonth, todaysYear)).to.be.true;
    expect(isValidCurrentOrPastMonthYear(todaysMonth + 1, todaysYear)).to.be
      .false;
  });
});
