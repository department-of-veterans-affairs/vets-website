import { expect } from 'chai';
import {
  isDependent,
  isVeteran,
  reformatData,
  transform,
  generateGender,
} from '../../config/helpers';
import config from '../../config/form';
import { veteranFormData, dependentFormData } from '../fixtures/formData';

describe('25-8832 - helpers', () => {
  describe('isDependent', () => {
    it('should return appropriate boolean value', () => {
      expect(isDependent({ status: 'isChild' })).to.be.true;
      expect(isDependent({ status: 'isSpouse' })).to.be.true;
      expect(isDependent({ status: '' })).to.be.false;
      expect(isDependent({ status: 'isVeteran' })).to.be.false;
    });
  });

  describe('isVeteran', () => {
    it('should return appropriate boolean value', () => {
      expect(isVeteran({ status: 'isVeteran' })).to.be.true;
      expect(isVeteran({ status: 'isActiveDuty' })).to.be.true;
      expect(isVeteran({ status: 'isChild' })).to.be.false;
    });
  });

  describe('reformatData', () => {
    it('should format the data appropriately', () => {
      expect(reformatData(veteranFormData)).to.includes({
        veteranSocialSecurityNumber: '1234567890',
        status: 'isActiveDuty',
      });
      expect(reformatData(dependentFormData)).to.includes({
        veteranSocialSecurityNumber: '1234567890',
        status: 'isChild',
      });
    });
  });

  describe('generateGender', () => {
    it('should return the correct gender', () => {
      expect(generateGender(null)).to.eql('-');
      expect(generateGender(undefined)).to.eql('-');
      expect(generateGender('M')).to.eql('Male');
      expect(generateGender('F')).to.eql('Female');
    });
  });

  describe('transform', () => {
    it('should transform data into a stringified JSON', () => {
      expect(typeof transform(config, veteranFormData) === 'string').to.be.true;
    });
  });
});
