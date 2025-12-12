import { expect } from 'chai';
import {
  isPatientVeteran,
  isPatientSpouseOrParentOrChild,
} from './patientType';

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

    it('should return false when patient type is spouse', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'spouse',
        },
      };
      expect(isPatientVeteran(formData)).to.be.false;
    });

    it('should return false when patient type is parent', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'parent',
        },
      };
      expect(isPatientVeteran(formData)).to.be.false;
    });

    it('should return false when patient type is child', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'child',
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

  describe('isPatientSpouseOrParentOrChild', () => {
    it('should return true when patient type is spouse', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'spouse',
        },
      };
      expect(isPatientSpouseOrParentOrChild(formData)).to.be.true;
    });

    it('should return true when patient type is parent', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'parent',
        },
      };
      expect(isPatientSpouseOrParentOrChild(formData)).to.be.true;
    });

    it('should return true when patient type is child', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'child',
        },
      };
      expect(isPatientSpouseOrParentOrChild(formData)).to.be.true;
    });

    it('should return false when patient type is veteran', () => {
      const formData = {
        claimantQuestion: {
          patientType: 'veteran',
        },
      };
      expect(isPatientSpouseOrParentOrChild(formData)).to.be.false;
    });

    it('should return false when formData is null', () => {
      expect(isPatientSpouseOrParentOrChild(null)).to.be.false;
    });

    it('should return false when formData is undefined', () => {
      expect(isPatientSpouseOrParentOrChild(undefined)).to.be.false;
    });

    it('should return false when formData is an array', () => {
      expect(isPatientSpouseOrParentOrChild([])).to.be.false;
    });

    it('should return false when formData is not an object', () => {
      expect(isPatientSpouseOrParentOrChild('string')).to.be.false;
      expect(isPatientSpouseOrParentOrChild(123)).to.be.false;
    });

    it('should return false when claimantQuestion is missing', () => {
      const formData = {};
      expect(isPatientSpouseOrParentOrChild(formData)).to.be.false;
    });
  });
});
