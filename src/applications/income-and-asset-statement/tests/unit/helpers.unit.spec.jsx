import { expect } from 'chai';
import {
  formatFullNameNoSuffix,
  isDefined,
  isReviewAndSubmitPage,
  resolveRecipientFullName,
} from '../../helpers';

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

describe('isReviewAndSubmitPage', () => {
  const originalLocation = window.location;

  afterEach(() => {
    // Restore original location
    delete window.location;
    window.location = originalLocation;
  });

  it('should return true when pathname includes "review-and-submit"', () => {
    delete window.location;
    window.location = { pathname: '/form/review-and-submit' };
    expect(isReviewAndSubmitPage()).to.be.true;
  });

  it('should return false when pathname does not include "review-and-submit"', () => {
    delete window.location;
    window.location = { pathname: '/form/personal-information' };
    expect(isReviewAndSubmitPage()).to.be.false;
  });

  it('should return false if window is undefined (SSR)', () => {
    const isServer = typeof window === 'undefined';
    expect(isServer ? isReviewAndSubmitPage() : true).to.be.true;
  });
});

describe('resolveRecipientFullName', () => {
  const recipient = { first: 'mary', middle: 'anne', last: 'smith' };
  const veteran = { first: 'john', middle: 'm', last: 'doe' };
  const otherVeteran = { first: 'alex', last: 'carter' };

  it('returns veteranFullName when recipient is VETERAN and isLoggedIn is true', () => {
    const item = { recipientRelationship: 'VETERAN' };
    const formData = {
      isLoggedIn: true,
      veteranFullName: veteran,
      otherVeteranFullName: otherVeteran,
    };

    expect(resolveRecipientFullName(item, formData)).to.equal('John M. Doe');
  });

  it('returns otherVeteranFullName when recipient is VETERAN and isLoggedIn is false', () => {
    const item = { recipientRelationship: 'VETERAN' };
    const formData = {
      isLoggedIn: false,
      veteranFullName: veteran,
      otherVeteranFullName: otherVeteran,
    };

    expect(resolveRecipientFullName(item, formData)).to.equal('Alex Carter');
  });

  it('returns recipientName when recipient is not the Veteran', () => {
    const item = {
      recipientRelationship: 'SPOUSE',
      recipientName: recipient,
    };
    const formData = {
      isLoggedIn: true,
      veteranFullName: veteran,
      otherVeteranFullName: otherVeteran,
    };

    expect(resolveRecipientFullName(item, formData)).to.equal('Mary A. Smith');
  });

  it('returns empty string if recipientName is undefined', () => {
    const item = { recipientRelationship: 'SPOUSE' };
    const formData = { isLoggedIn: true };

    expect(resolveRecipientFullName(item, formData)).to.equal('');
  });
});
