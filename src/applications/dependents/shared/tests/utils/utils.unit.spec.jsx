import { expect } from 'chai';
import { render } from '@testing-library/react';

import sinon from 'sinon';
import {
  getFullName,
  makeNamePossessive,
  maskID,
  isEmptyObject,
  getRootParentUrl,
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

describe('makeNamePossessive', () => {
  it('should add an apostrophe + s to names not ending with an s', () => {
    expect(makeNamePossessive('Fred')).to.equal('Fred’s');
    expect(makeNamePossessive('ALEX')).to.equal('ALEX’s');
  });
  it('should only add an apostrophe to names ending with an s', () => {
    expect(makeNamePossessive('JESS')).to.equal('JESS’');
    expect(makeNamePossessive('Chris')).to.equal('Chris’');
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
    const testDate = new Date().toISOString();
    localStorage.setItem('viewDependentsWarningClosedAt', testDate);

    const result = getIsDependentsWarningHidden();
    expect(result).to.be.true;
  });

  it('should return false and clear the stored date when a date is > 6 months old', () => {
    const testDate = '2025-06-01T10:00:00.000Z';
    localStorage.setItem('viewDependentsWarningClosedAt', testDate);

    const result = getIsDependentsWarningHidden();
    expect(result).to.be.false;

    const storedValue = localStorage.getItem('viewDependentsWarningClosedAt');
    expect(storedValue).to.be.null;
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
