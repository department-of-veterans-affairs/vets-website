import { expect } from 'chai';

import { isChapter33, displayConfirmEligibility } from '../helpers';

describe('helpers', () => {
  describe('isChapter33', () => {
    it('returns true for chapter33', () => {
      expect(isChapter33({ benefit: 'chapter33' })).to.equal(true);
    });
    it('returns true for fryScholarship', () => {
      expect(isChapter33({ benefit: 'fryScholarship' })).to.equal(true);
    });
    it('returns false for any other value', () => {
      expect(isChapter33({ benefit: 'chapter30' })).to.equal(false);
    });
  });

  describe('displayConfirmEligibility', () => {
    it('skips valid form data', () => {
      expect(
        displayConfirmEligibility({
          isEnrolledStem: true,
          benefitLeft: 'none',
          benefit: 'chapter33',
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
      expect(displayConfirmEligibility({ benefit: 'chapter30' })).to.equal(
        true,
      );
    });
  });
});
