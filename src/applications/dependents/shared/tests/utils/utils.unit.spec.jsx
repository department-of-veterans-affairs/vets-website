import { expect } from 'chai';
import { render } from '@testing-library/react';
import { format, sub } from 'date-fns';

import sinon from 'sinon';
import {
  getFullName,
  getFormatedDate,
  maskID,
  isEmptyObject,
  getRootParentUrl,
  calculateAge,
  hideDependentsWarning,
  getIsDependentsWarningHidden,
} from '../../utils';

describe('getFullName', () => {
  it('should return empty string for undefined name object', () => {
    const fullName = getFullName();
    expect(fullName).to.equal('');
  });

  it('should return empty string for empty name object', () => {
    const name = {};
    const fullName = getFullName(name);
    expect(fullName).to.equal('');
  });

  it('should return full name with first and last', () => {
    const name = { first: 'Alice', last: 'Smith' };
    const fullName = getFullName(name);
    expect(fullName).to.equal('Alice Smith');
  });

  it('should return full name with first, last, and suffix', () => {
    const name = {
      first: 'Jane',
      last: 'Doe',
      suffix: 'Sr.',
    };
    const fullName = getFullName(name);
    expect(fullName).to.equal('Jane Doe, Sr.');
  });

  it('should return full name with first, middle, last, and suffix', () => {
    const name = {
      first: 'John',
      middle: 'A.',
      last: 'Doe',
      suffix: 'Jr.',
    };
    const fullName = getFullName(name);
    expect(fullName).to.equal('John A. Doe, Jr.');
  });
});

describe('maskID', () => {
  it('should mask all but the last 4 of the SSN', () => {
    const screen = render(maskID('1234-56-7890'));
    expect(screen.container.innerHTML).to.equal(
      '<span><span aria-hidden="true">●●●–●●-7890</span><span class="sr-only">ending with 7 8 9 0</span></span>',
    );
  });
  it('should not include mask for last 4 of the SSN', () => {
    const screen = render(maskID('1234-56-7890', ''));
    expect(screen.container.innerHTML).to.equal(
      '<span><span aria-hidden="true">7890</span><span class="sr-only">ending with 7 8 9 0</span></span>',
    );
  });
  it('should include custom mask for last 4 of the SSN', () => {
    const screen = render(maskID('1234-56-7890', 'xxx-xx-'));
    expect(screen.container.innerHTML).to.equal(
      '<span><span aria-hidden="true">xxx-xx-7890</span><span class="sr-only">ending with 7 8 9 0</span></span>',
    );
  });
});

describe('isEmptyObject', () => {
  it('should return true for an empty object', () => {
    const result = isEmptyObject({});
    expect(result).to.be.true;
  });

  it('should return false for a non-empty object', () => {
    const result = isEmptyObject({ key: 'value' });
    expect(result).to.be.false;
  });

  it('should return true for an object with empty nested objects', () => {
    const result = isEmptyObject({ a: {}, b: { c: {} } });
    expect(result).to.be.true;
  });

  it('should return false for an object with non-empty nested objects', () => {
    const result = isEmptyObject({ a: { b: 'value' } });
    expect(result).to.be.false;
  });
});

describe('getRootParentUrl', () => {
  it('should return the root parent URL for a URL without trailing slash', () => {
    expect(getRootParentUrl('/root/app-name/')).to.equal('/root');
    expect(
      getRootParentUrl('/view-change-dependents/add-remove-form-21-686c-674'),
    ).to.equal('/view-change-dependents');
    expect(
      getRootParentUrl('/manage-dependents/add-remove-form-21-686c-674'),
    ).to.equal('/manage-dependents');
    expect(
      getRootParentUrl('/view-change-dependents/add-remove-form-21-686c-674/'),
    ).to.equal('/view-change-dependents');
    expect(
      getRootParentUrl('/manage-dependents/add-remove-form-21-686c-674/'),
    ).to.equal('/manage-dependents');
  });
});

describe('getFormatedDate', () => {
  it('should return empty string for undefined date', () => {
    const formattedDate = getFormatedDate();
    expect(formattedDate).to.equal('Unknown date');
  });

  it('should return empty string for invalid date', () => {
    const formattedDate = getFormatedDate('Summer 2000');
    expect(formattedDate).to.equal('Summer 2000');
  });

  it('should return formatted date for valid date', () => {
    const formattedDate = getFormatedDate('2020-01-01');
    expect(formattedDate).to.equal('January 1, 2020');
  });
  it('should return formatted date for valid Date object', () => {
    const formattedDate = getFormatedDate('12/05/2022', 'MM/dd/yyyy', 'PPPP');
    expect(formattedDate).to.equal('Monday, December 5th, 2022');
  });
});

describe('calculateAge', () => {
  it('should return 0 age and empty strings if dob is not provided', () => {
    const result = calculateAge();
    expect(result).to.deep.equal({
      age: 0,
      dobStr: '',
      labeledAge: '',
    });
  });

  it('should return 0 age and empty strings if dob is invalid', () => {
    const result = calculateAge('');
    expect(result).to.deep.equal({
      age: 0,
      dobStr: '',
      labeledAge: '',
    });
  });

  it('should return 0 age and correct dobStr for future dates', () => {
    const testDate = sub(new Date(), {
      months: -1,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: 'Date in the future',
    });
  });

  it('should correctly calculate age an 18 year old', () => {
    const testDate = sub(new Date(), {
      years: 18,
      months: 1,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 18,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '18 years old',
    });
  });

  it('should correctly calculate age for a 1 year old', () => {
    const testDate = sub(new Date(), {
      years: 1,
      days: 3,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 1,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '1 year old',
    });
  });

  it('should correctly calculate age for a 4 month old', () => {
    const testDate = sub(new Date(), {
      months: 4,
      days: 3,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '4 months old',
    });
  });

  it('should correctly calculate age for a 1 month old', () => {
    const testDate = sub(new Date(), {
      months: 1,
      days: 1,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '1 month old',
    });
  });

  it('should correctly calculate age for a 10 day old', () => {
    const testDate = sub(new Date(), {
      days: 10,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '10 days old',
    });
  });

  it('should correctly calculate age for a 1 day old', () => {
    const testDate = sub(new Date(), {
      days: 1,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '1 day old',
    });
  });

  it('should correctly calculate age for a baby born today', () => {
    const testDate = new Date();
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: 'Newborn',
    });
  });
});

describe('getIsDependentsWarningHidden', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  it('should return false when no warning date is stored', () => {
    const result = getIsDependentsWarningHidden();
    expect(result).to.be.false;
  });

  it('should return true when a valid date is stored', () => {
    const testDate = '2023-12-01T10:00:00.000Z';
    localStorage.setItem('viewDependentsWarningClosedAt', testDate);

    const result = getIsDependentsWarningHidden();
    expect(result).to.be.true;
  });

  it('should return false when an invalid date string is stored', () => {
    localStorage.setItem('viewDependentsWarningClosedAt', 'invalid-date');

    const result = getIsDependentsWarningHidden();
    expect(result).to.be.false;
  });

  it('should return false when an empty string is stored', () => {
    localStorage.setItem('viewDependentsWarningClosedAt', '');

    const result = getIsDependentsWarningHidden();
    expect(result).to.be.false;
  });

  it('should return false when null is stored', () => {
    localStorage.setItem('viewDependentsWarningClosedAt', 'null');

    const result = getIsDependentsWarningHidden();
    expect(result).to.be.false;
  });
});

describe('hideDependentsWarning', () => {
  let clock;

  beforeEach(() => {
    const fixed = new Date('2023-12-01T10:00:00.000Z').getTime();
    clock = sinon.useFakeTimers({ now: fixed, toFake: ['Date'] });
  });
  afterEach(() => clock.restore());

  it('should store the current date in localStorage', () => {
    hideDependentsWarning();

    const storedValue = localStorage.getItem('viewDependentsWarningClosedAt');
    expect(storedValue).to.equal('2023-12-01T10:00:00.000Z');
  });

  it('should overwrite existing stored date', () => {
    // Set an initial date
    localStorage.setItem(
      'viewDependentsWarningClosedAt',
      '2023-01-01T00:00:00.000Z',
    );

    hideDependentsWarning();

    const storedValue = localStorage.getItem('viewDependentsWarningClosedAt');
    expect(storedValue).to.equal('2023-12-01T10:00:00.000Z');
  });

  it('should store a valid ISO string that can be parsed', () => {
    hideDependentsWarning();

    const storedValue = localStorage.getItem('viewDependentsWarningClosedAt');
    const parsedDate = new Date(storedValue);

    expect(Number.isNaN(parsedDate.getTime())).to.be.false;
    expect(parsedDate.toISOString()).to.equal('2023-12-01T10:00:00.000Z');
  });
});
