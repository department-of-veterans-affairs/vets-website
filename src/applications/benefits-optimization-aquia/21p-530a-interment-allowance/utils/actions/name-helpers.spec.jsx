/**
 * @module utils/nameHelpers.unit.spec
 * @description Unit tests for name helper functions
 */

import { expect } from 'chai';
import { getVeteranName } from './name-helpers';

describe('nameHelpers', () => {
  describe('getVeteranName', () => {
    it('should return full name when both first and last name exist', () => {
      const formData = {
        veteranInformation: {
          fullName: { first: 'Anakin', last: 'Skywalker' },
        },
      };
      expect(getVeteranName(formData)).to.equal('Anakin Skywalker');
    });

    it('should return first name only when last name is missing', () => {
      const formData = {
        veteranInformation: { fullName: { first: 'Anakin', last: '' } },
      };
      expect(getVeteranName(formData)).to.equal('Anakin');
    });

    it('should return last name only when first name is missing', () => {
      const formData = {
        veteranInformation: {
          fullName: { first: '', last: 'Skywalker' },
        },
      };
      expect(getVeteranName(formData)).to.equal('Skywalker');
    });

    it('should return default fallback when name is missing', () => {
      const formData = { veteranInformation: { fullName: {} } };
      expect(getVeteranName(formData)).to.equal('the Veteran');
    });

    it('should return custom fallback when provided', () => {
      const formData = { veteranInformation: { fullName: {} } };
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
          fullName: { first: '  Anakin  ', last: '  Skywalker  ' },
        },
      };
      expect(getVeteranName(formData)).to.equal('Anakin Skywalker');
    });
  });
});
