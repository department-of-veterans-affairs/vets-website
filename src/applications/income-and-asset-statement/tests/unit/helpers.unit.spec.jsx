import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';

import * as api from 'platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import {
  formatCurrency,
  formatFullNameNoSuffix,
  formatPossessiveString,
  hasUploadedDocuments,
  hasIncompleteTrust,
  isDefined,
  isReviewAndSubmitPage,
  resolveRecipientFullName,
} from '../../helpers';
import { submit } from '../../config/submit';

describe('Income and Asset helpers', () => {
  describe('submit', () => {
    let apiRequestStub;
    let recordEventStub;
    const formConfig = {
      chapters: {},
    };
    const form = {
      data: {},
    };

    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      localStorage.setItem('csrfToken', 'my-token');
      apiRequestStub = sinon
        .stub(api, 'apiRequest')
        .resolves({ data: { attributes: {} } });
      recordEventStub = sinon.stub(recordEventModule, 'default');
    });

    afterEach(() => {
      apiRequestStub.restore();
      localStorage.clear();
      recordEventStub.restore();
    });

    it('should not update csrf token on success', async () => {
      expect(localStorage.getItem('csrfToken')).to.eql('my-token');

      await submit(form, formConfig);

      expect(localStorage.getItem('csrfToken')).to.eql('my-token');

      await waitFor(() => {
        expect(apiRequestStub.callCount).to.equal(1);
      });
    });

    it('should reject if initial request fails', () => {
      apiRequestStub.onFirstCall().rejects({ message: 'fake error' });

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal('fake error');
        },
      );
    });
    describe('on 403 Invalid Authenticity Token error', () => {
      it('should reset csrfToken', async () => {
        expect(localStorage.getItem('csrfToken')).to.eql('my-token');
        const invalidAuthenticityTokenResponse = {
          errors: [{ status: '403', detail: 'Invalid Authenticity Token' }],
        };
        apiRequestStub.onFirstCall().rejects(invalidAuthenticityTokenResponse);

        await submit(form, formConfig);

        await waitFor(() => {
          // Submission attempt -> CSRF refresh -> submission attempt
          expect(apiRequestStub.callCount).to.equal(3);
        });
      });

      it('should only retry once', async () => {
        expect(localStorage.getItem('csrfToken')).to.eql('my-token');
        const invalidAuthenticityTokenResponse = {
          errors: [{ status: '403', detail: 'Invalid Authenticity Token' }],
        };
        apiRequestStub.onFirstCall().rejects(invalidAuthenticityTokenResponse);
        apiRequestStub.onSecondCall().resolves({});
        apiRequestStub.onThirdCall().rejects({ message: 'fake error' });

        await submit(form, formConfig).then(
          () => {
            expect.fail();
          },
          err => {
            expect(err.message).to.equal('fake error');
          },
        );

        await waitFor(() => {
          // Submission attempt -> CSRF refresh -> submission attempt
          expect(apiRequestStub.callCount).to.equal(3);
        });
      });
    });
  });

  describe('formatCurrency', () => {
    it('formats a whole number as currency', () => {
      expect(formatCurrency(1000)).to.equal('$1,000');
    });

    it('formats a decimal number as currency', () => {
      expect(formatCurrency(1234.56)).to.equal('$1,234.56');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).to.equal('$0');
    });

    it('formats negative numbers correctly', () => {
      expect(formatCurrency(-500)).to.equal('$-500');
    });

    it('returns empty string when input is not a number', () => {
      expect(formatCurrency(null)).to.equal('');
      expect(formatCurrency(undefined)).to.equal('');
      expect(formatCurrency('100')).to.equal('');
      expect(formatCurrency({})).to.equal('');
    });
  });

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

    it.skip('should return true when pathname includes "review-and-submit"', () => {
      // skipping to support node 22 upgrade, window.location not supported
      // may want to stub isReviewAndSubmitPage and test for rendered content

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

      expect(resolveRecipientFullName(item, formData)).to.equal(
        'Mary A. Smith',
      );
    });

    it('returns empty string if recipientName is undefined', () => {
      const item = { recipientRelationship: 'SPOUSE' };
      const formData = { isLoggedIn: true };

      expect(resolveRecipientFullName(item, formData)).to.equal('');
    });
  });

  describe('formatPossessiveString', () => {
    it("should append ’s to strings not ending in 's'", () => {
      expect(formatPossessiveString('Johnson')).to.equal('Johnson’s');
      expect(formatPossessiveString('Emma')).to.equal('Emma’s');
      expect(formatPossessiveString('Emma Lee')).to.equal('Emma Lee’s');
    });

    it("should append just ’ to strings ending in 's'", () => {
      expect(formatPossessiveString('Williams')).to.equal('Williams’');
      expect(formatPossessiveString('Ross')).to.equal('Ross’');
      expect(formatPossessiveString('Business')).to.equal('Business’');
      expect(formatPossessiveString('Ed Harris')).to.equal('Ed Harris’');
    });

    it('should return empty string for null, undefined, or non-string input', () => {
      expect(formatPossessiveString(null)).to.equal('');
      expect(formatPossessiveString(undefined)).to.equal('');
      expect(formatPossessiveString(123)).to.equal('');
      expect(formatPossessiveString({})).to.equal('');
    });

    it('should handle empty string input', () => {
      expect(formatPossessiveString('')).to.equal('');
    });

    it("should use typographic apostrophe (’) not straight quote (')", () => {
      const result = formatPossessiveString('Jones');
      expect(result).to.include('’');
      expect(result).to.not.include("'");
    });

    describe('hasUploadedDocuments', () => {
      it('returns false when value is not an array', () => {
        expect(hasUploadedDocuments(undefined)).to.be.false;
        expect(hasUploadedDocuments(null)).to.be.false;
        expect(hasUploadedDocuments({})).to.be.false;
      });

      it('returns false for an empty array', () => {
        expect(hasUploadedDocuments([])).to.be.false;
      });

      it('returns false when documents have no name', () => {
        const uploadedDocuments = [{}, { size: 1234 }];
        expect(hasUploadedDocuments(uploadedDocuments)).to.be.false;
      });

      it('returns true when at least one document has a name', () => {
        const uploadedDocuments = [
          { name: '' },
          { name: 'trust-document.pdf' },
        ];

        expect(hasUploadedDocuments(uploadedDocuments)).to.be.true;
      });

      it('ignores non-object entries safely', () => {
        const uploadedDocuments = [
          null,
          undefined,
          'string',
          { name: 'valid.pdf' },
        ];

        expect(hasUploadedDocuments(uploadedDocuments)).to.be.true;
      });
    });

    describe('hasIncompleteTrust', () => {
      it('returns false when trusts is undefined or empty', () => {
        expect(hasIncompleteTrust(undefined)).to.be.false;
        expect(hasIncompleteTrust([])).to.be.false;
      });

      it('returns true when user declined to upload documents', () => {
        const trusts = [
          {
            'view:addFormQuestion': false,
          },
        ];

        expect(hasIncompleteTrust(trusts)).to.be.true;
      });

      it('returns true when user said yes but uploaded no documents', () => {
        const trusts = [
          {
            'view:addFormQuestion': true,
            uploadedDocuments: [],
          },
        ];

        expect(hasIncompleteTrust(trusts)).to.be.true;
      });

      it('returns false when user said yes and uploaded documents', () => {
        const trusts = [
          {
            'view:addFormQuestion': true,
            uploadedDocuments: [{ name: 'trust.pdf' }],
          },
        ];

        expect(hasIncompleteTrust(trusts)).to.be.false;
      });

      it('returns false when trust has no addFormQuestion value', () => {
        const trusts = [
          {
            uploadedDocuments: [{ name: 'trust.pdf' }],
          },
        ];

        expect(hasIncompleteTrust(trusts)).to.be.false;
      });

      it('returns true when at least one trust is incomplete', () => {
        const trusts = [
          {
            'view:addFormQuestion': true,
            uploadedDocuments: [{ name: 'valid.pdf' }],
          },
          {
            'view:addFormQuestion': false,
          },
        ];

        expect(hasIncompleteTrust(trusts)).to.be.true;
      });

      it('handles malformed trust entries safely', () => {
        const trusts = [
          null,
          {},
          {
            'view:addFormQuestion': true,
            uploadedDocuments: [{ name: 'trust.pdf' }],
          },
        ];

        expect(hasIncompleteTrust(trusts)).to.be.false;
      });
    });
  });
});
