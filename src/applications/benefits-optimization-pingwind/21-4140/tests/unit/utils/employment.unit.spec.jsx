import { expect } from 'chai';

import {
  hasEmploymentInLast12Months,
  shouldShowEmploymentSection,
  shouldShowUnemploymentSection,
} from '../../../utils/employment';
import {
  employedByVAFields,
  employmentCheckFields,
} from '../../../definitions/constants';

describe('21-4140 utils/employment', () => {
  describe('hasEmploymentInLast12Months', () => {
    it('returns true when the current selection is yes', () => {
      const formData = {
        [employmentCheckFields.parentObject]: {
          [employmentCheckFields.hasEmploymentInLast12Months]: 'yes',
        },
      };

      expect(hasEmploymentInLast12Months(formData)).to.be.true;
    });

    it('returns false when the current selection is no', () => {
      const formData = {
        [employmentCheckFields.parentObject]: {
          [employmentCheckFields.hasEmploymentInLast12Months]: 'no',
        },
      };

      expect(hasEmploymentInLast12Months(formData)).to.be.false;
    });

    it('falls back to legacy employed by VA data when no current selection exists', () => {
      const formData = {
        [employmentCheckFields.parentObject]: {},
        [employedByVAFields.parentObject]: {
          [employedByVAFields.isEmployedByVA]: 'Y',
        },
      };

      expect(hasEmploymentInLast12Months(formData)).to.be.true;
    });

    it('returns false when legacy employed by VA data is "N"', () => {
      const formData = {
        [employmentCheckFields.parentObject]: {},
        [employedByVAFields.parentObject]: {
          [employedByVAFields.isEmployedByVA]: 'N',
        },
      };

      expect(hasEmploymentInLast12Months(formData)).to.be.false;
    });

    it('returns undefined when no employment information is present', () => {
      expect(hasEmploymentInLast12Months({})).to.be.undefined;
      expect(hasEmploymentInLast12Months()).to.be.undefined;
    });
  });

  describe('shouldShowEmploymentSection', () => {
    it('returns true only when employment in the last 12 months is true', () => {
      const formData = {
        [employmentCheckFields.parentObject]: {
          [employmentCheckFields.hasEmploymentInLast12Months]: 'yes',
        },
      };

      expect(shouldShowEmploymentSection(formData)).to.be.true;
      expect(shouldShowEmploymentSection({})).to.be.false;
    });
  });

  describe('shouldShowUnemploymentSection', () => {
    it('returns true only when employment in the last 12 months is false', () => {
      const formData = {
        [employmentCheckFields.parentObject]: {
          [employmentCheckFields.hasEmploymentInLast12Months]: 'no',
        },
      };

      expect(shouldShowUnemploymentSection(formData)).to.be.true;
      expect(shouldShowUnemploymentSection({})).to.be.false;
    });
  });
});
