import { expect } from 'chai';

import {
  getValidationErrors,
  isValidCurrentOrPastMonthYear,
  isValidDateRange,
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

describe('isValidDateRange', () => {
  it('validates if to date is after from date', () => {
    const fromDate = {
      day: {
        value: '3',
        dirty: true,
      },
      month: {
        value: '3',
        dirty: true,
      },
      year: {
        value: '2006',
        dirty: true,
      },
    };
    const toDate = {
      day: {
        value: '3',
        dirty: true,
      },
      month: {
        value: '4',
        dirty: true,
      },
      year: {
        value: '2006',
        dirty: true,
      },
    };
    expect(isValidDateRange(fromDate, toDate)).to.be.true;
  });
  it('does not validate to date is before from date', () => {
    const fromDate = {
      day: {
        value: '3',
        dirty: true,
      },
      month: {
        value: '3',
        dirty: true,
      },
      year: {
        value: '2006',
        dirty: true,
      },
    };
    const toDate = {
      day: {
        value: '3',
        dirty: true,
      },
      month: {
        value: '4',
        dirty: true,
      },
      year: {
        value: '2005',
        dirty: true,
      },
    };
    expect(isValidDateRange(fromDate, toDate)).to.be.false;
  });
  it('does validate with partial dates', () => {
    const fromDate = {
      day: {
        value: '3',
        dirty: true,
      },
      month: {
        value: '3',
        dirty: true,
      },
      year: {
        value: '2006',
        dirty: true,
      },
    };
    const toDate = {
      day: {
        value: '',
        dirty: true,
      },
      month: {
        value: '',
        dirty: true,
      },
      year: {
        value: '',
        dirty: true,
      },
    };
    expect(isValidDateRange(fromDate, toDate)).to.be.true;
  });
  it('validates with missing month and day', () => {
    const fromDate = {
      day: {
        value: 'XX',
        dirty: true,
      },
      month: {
        value: 'XX',
        dirty: true,
      },
      year: {
        value: '2006',
        dirty: true,
      },
    };
    const toDate = {
      day: {
        value: 'XX',
        dirty: true,
      },
      month: {
        value: 'XX',
        dirty: true,
      },
      year: {
        value: '2007',
        dirty: true,
      },
    };
    expect(isValidDateRange(fromDate, toDate)).to.be.true;
  });
  it('invalidates with missing month and day', () => {
    const fromDate = {
      day: {
        value: 'XX',
        dirty: true,
      },
      month: {
        value: 'XX',
        dirty: true,
      },
      year: {
        value: '2008',
        dirty: true,
      },
    };
    const toDate = {
      day: {
        value: 'XX',
        dirty: true,
      },
      month: {
        value: 'XX',
        dirty: true,
      },
      year: {
        value: '2007',
        dirty: true,
      },
    };
    expect(isValidDateRange(fromDate, toDate)).to.be.false;
  });
  it('validates with missing months', () => {
    const fromDate = {
      day: {
        value: '1',
        dirty: true,
      },
      month: {
        value: 'XX',
        dirty: true,
      },
      year: {
        value: '2006',
        dirty: true,
      },
    };
    const toDate = {
      day: {
        value: '1',
        dirty: true,
      },
      month: {
        value: 'XX',
        dirty: true,
      },
      year: {
        value: '2007',
        dirty: true,
      },
    };
    expect(isValidDateRange(fromDate, toDate)).to.be.true;
  });
  it('validates with missing days', () => {
    const fromDate = {
      day: {
        value: 'XX',
        dirty: true,
      },
      month: {
        value: '3',
        dirty: true,
      },
      year: {
        value: '2006',
        dirty: true,
      },
    };
    const toDate = {
      day: {
        value: 'XX',
        dirty: true,
      },
      month: {
        value: '4',
        dirty: true,
      },
      year: {
        value: '2006',
        dirty: true,
      },
    };
    expect(isValidDateRange(fromDate, toDate)).to.be.true;
  });
});
