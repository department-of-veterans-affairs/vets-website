import { expect } from 'chai';
import { isPatientVeteran, isPatientSpouseOrParent } from './patientType';

describe('patientType utilities', () => {
  describe('isPatientVeteran', () => {
    it('should return true when patient type is veteran', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'veteran',
        },
      };
      expect(isPatientVeteran(formData)).to.be.true;
    });

    it('should return false when patient type is spouseOrParent', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'spouseOrParent',
        },
      };
      expect(isPatientVeteran(formData)).to.be.false;
    });

    it('should return false when formData is null', () => {
      expect(isPatientVeteran(null)).to.be.false;
    });

    it('should return false when formData is undefined', () => {
      expect(isPatientVeteran(undefined)).to.be.false;
    });

    it('should return false when formData is an array', () => {
      expect(isPatientVeteran([])).to.be.false;
    });

    it('should return false when formData is not an object', () => {
      expect(isPatientVeteran('string')).to.be.false;
      expect(isPatientVeteran(123)).to.be.false;
      expect(isPatientVeteran(true)).to.be.false;
    });

    it('should return false when claimantQuestion is missing', () => {
      const formData = {};
      expect(isPatientVeteran(formData)).to.be.false;
    });

    it('should return false when patientType is missing', () => {
      const formData = {
        claimantQuestion: {},
      };
      expect(isPatientVeteran(formData)).to.be.false;
    });
  });

  describe('isPatientSpouseOrParent', () => {
    it('should return true when patient type is spouseOrParent', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'spouseOrParent',
        },
      };
      expect(isPatientSpouseOrParent(formData)).to.be.true;
    });

    it('should return false when patient type is veteran', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'veteran',
        },
      };
      expect(isPatientSpouseOrParent(formData)).to.be.false;
    });

    it('should return false when formData is null', () => {
      expect(isPatientSpouseOrParent(null)).to.be.false;
    });

    it('should return false when formData is undefined', () => {
      expect(isPatientSpouseOrParent(undefined)).to.be.false;
    });

    it('should return false when formData is an array', () => {
      expect(isPatientSpouseOrParent([])).to.be.false;
    });

    it('should return false when formData is not an object', () => {
      expect(isPatientSpouseOrParent('string')).to.be.false;
      expect(isPatientSpouseOrParent(123)).to.be.false;
    });

    it('should return false when claimantQuestion is missing', () => {
      const formData = {};
      expect(isPatientSpouseOrParent(formData)).to.be.false;
    });
  });
});
