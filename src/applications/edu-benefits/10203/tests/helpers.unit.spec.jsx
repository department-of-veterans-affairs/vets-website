import { expect } from 'chai';

import { isChapter33, displayConfirmEligibility } from '../helpers';

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
});
