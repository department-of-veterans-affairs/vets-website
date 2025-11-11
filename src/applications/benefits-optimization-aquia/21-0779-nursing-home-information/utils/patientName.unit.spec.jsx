import { expect } from 'chai';
import { getPatientName } from './patientName';

describe('patientName utilities', () => {
  describe('getPatientName', () => {
    describe('when patient is veteran', () => {
      it('should return veteran full name with middle name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'veteran',
          },
          veteranPersonalInfo: {
            fullName: {
              first: 'Anakin',
              middle: 'L',
              last: 'Skywalker',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Anakin L Skywalker');
      });

      it('should return veteran full name without middle name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'veteran',
          },
          veteranPersonalInfo: {
            fullName: {
              first: 'Anakin',
              last: 'Skywalker',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Anakin Skywalker');
      });

      it('should return veteran name with only first name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'veteran',
          },
          veteranPersonalInfo: {
            fullName: {
              first: 'Anakin',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Anakin');
      });

      it('should return veteran name with only last name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'veteran',
          },
          veteranPersonalInfo: {
            fullName: {
              last: 'Skywalker',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Skywalker');
      });

      it('should return default when veteran name is missing', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'veteran',
          },
          veteranPersonalInfo: {
            fullName: {},
          },
        };
        expect(getPatientName(formData)).to.equal('the patient');
      });

      it('should return default when veteranPersonalInfo is missing', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'veteran',
          },
        };
        expect(getPatientName(formData)).to.equal('the patient');
      });

      it('should trim whitespace from veteran name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'veteran',
          },
          veteranPersonalInfo: {
            fullName: {
              first: '  Anakin  ',
              last: '  Skywalker  ',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Anakin     Skywalker');
      });
    });

    describe('when patient is spouse or parent', () => {
      it('should return claimant full name with middle name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'spouseOrParent',
          },
          claimantPersonalInfo: {
            claimantFullName: {
              first: 'Shmi',
              middle: 'E',
              last: 'Skywalker',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Shmi E Skywalker');
      });

      it('should return claimant full name without middle name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'spouseOrParent',
          },
          claimantPersonalInfo: {
            claimantFullName: {
              first: 'Shmi',
              last: 'Skywalker',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Shmi Skywalker');
      });

      it('should return claimant name with only first name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'spouseOrParent',
          },
          claimantPersonalInfo: {
            claimantFullName: {
              first: 'Shmi',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Shmi');
      });

      it('should return claimant name with only last name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'spouseOrParent',
          },
          claimantPersonalInfo: {
            claimantFullName: {
              last: 'Skywalker',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Skywalker');
      });

      it('should return default when claimant name is missing', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'spouseOrParent',
          },
          claimantPersonalInfo: {
            claimantFullName: {},
          },
        };
        expect(getPatientName(formData)).to.equal('the patient');
      });

      it('should return default when claimantPersonalInfo is missing', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'spouseOrParent',
          },
        };
        expect(getPatientName(formData)).to.equal('the patient');
      });

      it('should trim whitespace from claimant name', () => {
        const formData = {
          claimantQuestion: {
            patientType: 'spouseOrParent',
          },
          claimantPersonalInfo: {
            claimantFullName: {
              first: '  Shmi  ',
              last: '  Skywalker  ',
            },
          },
        };
        expect(getPatientName(formData)).to.equal('Shmi     Skywalker');
      });
    });

    describe('edge cases', () => {
      it('should return default when formData is null', () => {
        expect(getPatientName(null)).to.equal('the patient');
      });

      it('should return default when formData is undefined', () => {
        expect(getPatientName(undefined)).to.equal('the patient');
      });

      it('should return default when formData is an array', () => {
        expect(getPatientName([])).to.equal('the patient');
      });

      it('should return default when formData is not an object', () => {
        expect(getPatientName('string')).to.equal('the patient');
        expect(getPatientName(123)).to.equal('the patient');
      });

      it('should return default when claimantQuestion is missing', () => {
        const formData = {};
        expect(getPatientName(formData)).to.equal('the patient');
      });

      it('should return default when patientType is missing', () => {
        const formData = {
          claimantQuestion: {},
        };
        expect(getPatientName(formData)).to.equal('the patient');
      });
    });
  });
});
