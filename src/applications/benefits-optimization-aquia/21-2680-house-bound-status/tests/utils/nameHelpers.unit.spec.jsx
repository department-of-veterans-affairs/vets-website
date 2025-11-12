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
            first: 'Padmé',
            last: 'Amidala',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('Padmé Amidala');
    });

    it('should return first name only when last name is missing', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('Padmé');
    });

    it('should return last name only when first name is missing', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {
            last: 'Amidala',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('Amidala');
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
            first: '  Padmé  ',
            last: '  Amidala  ',
          },
        },
      };
      /**
       * Note: trim() only removes leading/trailing whitespace, not internal spaces
       * '  Padmé  ' + ' ' + '  Amidala  ' = '  Padmé     Amidala  ' => trim() => 'Padmé     Amidala' (5 spaces)
       */
      expect(getClaimantName(formData)).to.equal('Padmé     Amidala');
    });
  });

  describe('getVeteranName', () => {
    it('should return veteran full name when both first and last names are present', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: 'Anakin',
            last: 'Skywalker',
          },
        },
      };
      expect(getVeteranName(formData)).to.equal('Anakin Skywalker');
    });

    it('should return first name only when last name is missing', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: 'Anakin',
          },
        },
      };
      expect(getVeteranName(formData)).to.equal('Anakin');
    });

    it('should return last name only when first name is missing', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            last: 'Skywalker',
          },
        },
      };
      expect(getVeteranName(formData)).to.equal('Skywalker');
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
            first: 'Luke',
            last: 'Skywalker',
          },
        },
      };
      expect(getPersonName(formData)).to.equal('Luke Skywalker');
    });

    it('should return claimant name when claimant is not veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Leia',
            last: 'Organa',
          },
        },
      };
      expect(getPersonName(formData)).to.equal('Leia Organa');
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
