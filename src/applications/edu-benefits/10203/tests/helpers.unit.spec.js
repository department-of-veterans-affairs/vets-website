import { expect } from 'chai';

import {
  isChapter33,
  displayConfirmEligibility,
  phoneNumberFormatted,
} from '../helpers';

describe('helpers', () => {
  describe('isChapter33', () => {
    it('returns true for chapter33', () => {
      expect(isChapter33({ 'view:benefit': { chapter33: true } })).to.equal(
        true,
      );
    });
    it('returns true for fryScholarship', () => {
      expect(
        isChapter33({ 'view:benefit': { fryScholarship: true } }),
      ).to.equal(true);
    });
    it('returns false for any other value', () => {
      expect(isChapter33({ 'view:benefit': { chapter30: true } })).to.equal(
        false,
      );
    });
  });

  describe('displayConfirmEligibility', () => {
    it('skips valid form data', () => {
      expect(
        displayConfirmEligibility({
          isEnrolledStem: true,
          benefitLeft: 'none',
          'view:benefit': { chapter33: true },
        }),
      ).to.equal(false);
    });
    it('invalid benefitLeft', () => {
      expect(
        displayConfirmEligibility({ benefitLeft: 'moreThanSixMonths' }),
      ).to.equal(true);
    });
    it('invalid enrollment', () => {
      expect(displayConfirmEligibility({ isEnrolledStem: false })).to.equal(
        true,
      );
    });
    it('invalid benefit', () => {
      expect(
        displayConfirmEligibility({ 'view:benefit': { chapter30: true } }),
      ).to.equal(true);
    });
  });

  describe('phoneNumberFormatted', () => {
    it('evaluates phone number input correctly for 10 digits', () => {
      expect(phoneNumberFormatted('0123456789')).to.equal(true);
      expect(phoneNumberFormatted('012')).to.equal(false);
      expect(phoneNumberFormatted('012345678910111213')).to.equal(false);
    });
    it('evaluates phone number input correctly for 10 digits with dashes', () => {
      expect(phoneNumberFormatted('012-345-6789')).to.equal(true);
      expect(phoneNumberFormatted('012-34-5678')).to.equal(false);
      expect(phoneNumberFormatted('012-345-6789-10-11-12-13')).to.equal(false);
    });
  });
});
