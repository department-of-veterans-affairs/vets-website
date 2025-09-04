import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  getFullName,
  maskID,
  isEmptyObject,
  getRootParentUrl,
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
