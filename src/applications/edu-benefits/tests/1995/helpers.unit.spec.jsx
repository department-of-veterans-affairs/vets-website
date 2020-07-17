import { expect } from 'chai';

import {
  display1995StemFlow,
  displayStemEligibility,
  isChapter33,
} from '../../1995/helpers';

const defaultForm = {
  benefit: 'chapter33',
  isEdithNourseRogersScholarship: true,
  'view:exhaustionOfBenefits': true,
  'view:exhaustionOfBenefitsAfterPursuingTeachingCert': true,
  isEnrolledStem: true,
  isPursuingTeachingCert: true,
};
describe('helpers', () => {
  describe('isChapter33', () => {
    it('if benefit is chapter33', () => {
      expect(isChapter33(defaultForm)).to.equal(true);
    });
    it('if benefit is fryScholarship', () => {
      const form = {
        ...defaultForm,
        benefit: 'fryScholarship',
      };
      expect(isChapter33(form)).to.equal(true);
    });
    it('is not if benefit is chapter30', () => {
      const form = {
        ...defaultForm,
        benefit: 'chapter30',
      };
      expect(isChapter33(form)).to.equal(false);
    });
  });
  describe('displayStemEligibility', () => {
    it('is not displayed', () => {
      expect(displayStemEligibility(defaultForm)).to.equal(false);
    });
    it('when benefit is not chapter33', () => {
      const form = {
        ...defaultForm,
        benefit: 'chapter30',
      };
      expect(displayStemEligibility(form)).to.equal(true);
    });
    it('when benefit is not selected', () => {
      const form = {
        ...defaultForm,
        benefit: undefined,
      };
      expect(displayStemEligibility(form)).to.equal(false);
    });
    it('when either exhaustionOfBenefitses are false', () => {
      const form = {
        ...defaultForm,
        'view:exhaustionOfBenefits': false,
        'view:exhaustionOfBenefitsAfterPursuingTeachingCert': false,
      };
      expect(displayStemEligibility(form)).to.equal(true);
    });
    it('when isEnrolledStem and isPursuingTeachingCert are false', () => {
      const form = {
        ...defaultForm,
        isEnrolledStem: false,
        isPursuingTeachingCert: false,
      };
      expect(displayStemEligibility(form)).to.equal(true);
    });
  });

  it('display1995StemFlow', () => {
    it(' if eligible and isEdithNourseRogersScholarship', () => {
      expect(display1995StemFlow(defaultForm)).to.equal(true);
    });
    it('is not displayed if not EdithNourseRogersScholarship', () => {
      const form = {
        ...defaultForm,
        isEdithNourseRogersScholarship: false,
      };
      expect(display1995StemFlow(form)).to.equal(false);
    });
  });
});
