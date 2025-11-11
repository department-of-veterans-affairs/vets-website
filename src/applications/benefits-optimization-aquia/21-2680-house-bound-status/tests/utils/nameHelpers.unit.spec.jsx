/**
 * @module tests/utils/nameHelpers.unit.spec
 * @description Unit tests for name helper functions
 */

import { expect } from 'chai';
import {
  getClaimantName,
  getVeteranName,
  getPersonName,
} from '../../utils/nameHelpers';

describe('nameHelpers', () => {
  describe('getClaimantName', () => {
    it('should return claimant full name when both first and last names are present', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('John Doe');
    });

    it('should return first name only when last name is missing', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {
            first: 'John',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('John');
    });

    it('should return last name only when first name is missing', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {
            last: 'Doe',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('Doe');
    });

    it('should return default fallback when name is not present', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {},
        },
      };
      expect(getClaimantName(formData)).to.equal('the claimant');
    });

    it('should return custom fallback when provided', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {},
        },
      };
      expect(getClaimantName(formData, 'applicant')).to.equal('applicant');
    });

    it('should return fallback for invalid formData', () => {
      expect(getClaimantName(null)).to.equal('the claimant');
      expect(getClaimantName(undefined)).to.equal('the claimant');
      expect(getClaimantName([])).to.equal('the claimant');
      expect(getClaimantName('string')).to.equal('the claimant');
    });

    it('should trim whitespace from names', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {
            first: '  John  ',
            last: '  Doe  ',
          },
        },
      };
      /**
       * Note: trim() only removes leading/trailing whitespace, not internal spaces
       * '  John  ' + ' ' + '  Doe  ' = '  John     Doe  ' => trim() => 'John     Doe' (5 spaces)
       */
      expect(getClaimantName(formData)).to.equal('John     Doe');
    });
  });

  describe('getVeteranName', () => {
    it('should return veteran full name when both first and last names are present', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: 'Jane',
            last: 'Smith',
          },
        },
      };
      expect(getVeteranName(formData)).to.equal('Jane Smith');
    });

    it('should return first name only when last name is missing', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: 'Jane',
          },
        },
      };
      expect(getVeteranName(formData)).to.equal('Jane');
    });

    it('should return last name only when first name is missing', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            last: 'Smith',
          },
        },
      };
      expect(getVeteranName(formData)).to.equal('Smith');
    });

    it('should return default fallback when name is not present', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {},
        },
      };
      expect(getVeteranName(formData)).to.equal('the Veteran');
    });

    it('should return custom fallback when provided', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {},
        },
      };
      expect(getVeteranName(formData, 'service member')).to.equal(
        'service member',
      );
    });

    it('should return fallback for invalid formData', () => {
      expect(getVeteranName(null)).to.equal('the Veteran');
      expect(getVeteranName(undefined)).to.equal('the Veteran');
      expect(getVeteranName([])).to.equal('the Veteran');
    });
  });

  describe('getPersonName', () => {
    it('should return veteran name when claimant is veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {
            first: 'John',
            last: 'Veteran',
          },
        },
      };
      expect(getPersonName(formData)).to.equal('John Veteran');
    });

    it('should return claimant name when claimant is not veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Jane',
            last: 'Spouse',
          },
        },
      };
      expect(getPersonName(formData)).to.equal('Jane Spouse');
    });

    it('should use custom fallbacks for veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };
      expect(
        getPersonName(formData, {
          veteranFallback: 'service member',
          claimantFallback: 'applicant',
        }),
      ).to.equal('service member');
    });

    it('should use custom fallbacks for claimant', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
      };
      expect(
        getPersonName(formData, {
          veteranFallback: 'service member',
          claimantFallback: 'applicant',
        }),
      ).to.equal('applicant');
    });

    it('should return default veteran fallback when no name available', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };
      expect(getPersonName(formData)).to.equal('the Veteran');
    });

    it('should return default claimant fallback when no name available', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
      };
      expect(getPersonName(formData)).to.equal('the claimant');
    });
  });
});
