/**
 * @module utils/nameHelpers.unit.spec
 * @description Unit tests for name helper functions
 */

import { expect } from 'chai';
import { getClaimantName, getVeteranName } from './name-helpers';

describe('nameHelpers', () => {
  describe('getClaimantName', () => {
    it('should return full name when both first and last name exist', () => {
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
            last: '',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('Padmé');
    });

    it('should return last name only when first name is missing', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {
            first: '',
            last: 'Amidala',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('Amidala');
    });

    it('should return default fallback when name is missing', () => {
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
      expect(getClaimantName(formData, 'custom fallback')).to.equal(
        'custom fallback',
      );
    });

    it('should return fallback when claimantInformation is missing', () => {
      const formData = {};
      expect(getClaimantName(formData)).to.equal('the claimant');
    });

    it('should return fallback when formData is null', () => {
      expect(getClaimantName(null)).to.equal('the claimant');
    });

    it('should return fallback when formData is undefined', () => {
      expect(getClaimantName(undefined)).to.equal('the claimant');
    });

    it('should return fallback when formData is an array', () => {
      expect(getClaimantName([])).to.equal('the claimant');
    });

    it('should return fallback when formData is a string', () => {
      expect(getClaimantName('invalid')).to.equal('the claimant');
    });

    it('should handle names with surrounding whitespace', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {
            first: '  Padmé  ',
            last: '  Amidala  ',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('Padmé     Amidala');
    });

    it('should handle names with middle spaces', () => {
      const formData = {
        claimantInformation: {
          claimantFullName: {
            first: 'Obi-Wan',
            last: 'Kenobi',
          },
        },
      };
      expect(getClaimantName(formData)).to.equal('Obi-Wan Kenobi');
    });
  });

  describe('getVeteranName', () => {
    it('should return full name when both first and last name exist', () => {
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
            last: '',
          },
        },
      };
      expect(getVeteranName(formData)).to.equal('Anakin');
    });

    it('should return last name only when first name is missing', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: '',
            last: 'Skywalker',
          },
        },
      };
      expect(getVeteranName(formData)).to.equal('Skywalker');
    });

    it('should return default fallback when name is missing', () => {
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
      expect(getVeteranName(formData, 'custom fallback')).to.equal(
        'custom fallback',
      );
    });

    it('should return fallback when veteranInformation is missing', () => {
      const formData = {};
      expect(getVeteranName(formData)).to.equal('the Veteran');
    });

    it('should return fallback when formData is null', () => {
      expect(getVeteranName(null)).to.equal('the Veteran');
    });

    it('should return fallback when formData is undefined', () => {
      expect(getVeteranName(undefined)).to.equal('the Veteran');
    });

    it('should return fallback when formData is an array', () => {
      expect(getVeteranName([])).to.equal('the Veteran');
    });

    it('should return fallback when formData is a string', () => {
      expect(getVeteranName('invalid')).to.equal('the Veteran');
    });

    it('should handle names with surrounding whitespace', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: {
            first: '  Anakin  ',
            last: '  Skywalker  ',
          },
        },
      };
      expect(getVeteranName(formData)).to.equal('Anakin     Skywalker');
    });
  });
});
