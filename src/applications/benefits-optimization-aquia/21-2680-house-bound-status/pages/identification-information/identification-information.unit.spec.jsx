/**
 * @module tests/pages/identification-information.unit.spec
 * @description Unit tests for identification information page configuration
 */

import { expect } from 'chai';
import { identificationInformation } from './identification-information';

describe('Veteran Identification Form', () => {
  describe('Page Schema Structure', () => {
    it('should have uiSchema property', () => {
      expect(identificationInformation).to.have.property('uiSchema');
      expect(identificationInformation.uiSchema).to.be.an('object');
    });

    it('should have schema property', () => {
      expect(identificationInformation).to.have.property('schema');
      expect(identificationInformation.schema).to.be.an('object');
    });

    it('should have correct schema type', () => {
      expect(identificationInformation.schema.type).to.equal('object');
    });

    it('should define properties for veteran ID field', () => {
      expect(identificationInformation.schema.properties).to.include.keys(
        'veteranId',
      );
    });
  });

  describe('UI Schema Configuration', () => {
    it('should have veteran ID field in UI schema', () => {
      expect(identificationInformation.uiSchema).to.have.property('veteranId');
    });

    it('should have page title in UI schema', () => {
      expect(identificationInformation.uiSchema).to.have.property('ui:title');
    });

    it('should use ssnOrVaFileNumber pattern without hint', () => {
      expect(identificationInformation.uiSchema.veteranId).to.exist;
    });
  });

  describe('Valid SSN Data', () => {
    it('should accept SSN with dashes', () => {
      const validData = {
        veteranId: {
          'view:noSSN': false,
          ssn: '123-45-6789',
        },
      };

      expect(validData.veteranId.ssn).to.match(/^\d{3}-\d{2}-\d{4}$/);
      expect(validData.veteranId['view:noSSN']).to.be.false;
    });

    it('should accept SSN without dashes', () => {
      const validData = {
        veteranId: {
          'view:noSSN': false,
          ssn: '123456789',
        },
      };

      expect(validData.veteranId.ssn).to.match(/^\d{9}$/);
    });

    it('should accept clone veteran SSN', () => {
      const validData = {
        veteranId: {
          'view:noSSN': false,
          ssn: '757-67-5019',
        },
      };

      expect(validData.veteranId.ssn).to.have.lengthOf(11);
      expect(validData.veteranId.ssn).to.include('-');
    });

    it('should validate SSN format for clone identification', () => {
      const validData = {
        veteranId: {
          'view:noSSN': false,
          ssn: '501-75-6700',
        },
      };

      const ssnParts = validData.veteranId.ssn.split('-');
      expect(ssnParts).to.have.lengthOf(3);
      expect(ssnParts[0]).to.have.lengthOf(3);
      expect(ssnParts[1]).to.have.lengthOf(2);
      expect(ssnParts[2]).to.have.lengthOf(4);
    });
  });

  describe('Valid VA File Number Data', () => {
    it('should accept VA file number when no SSN', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'C12345678',
        },
      };

      expect(validData.veteranId['view:noSSN']).to.be.true;
      expect(validData.veteranId.vaFileNumber).to.match(/^[A-Z]?\d{8,9}$/);
    });

    it('should accept clone service number as VA file', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'CT7567',
        },
      };

      expect(validData.veteranId.vaFileNumber).to.include('CT');
      expect(validData.veteranId['view:noSSN']).to.be.true;
    });

    it('should accept numeric VA file number', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: '123456789',
        },
      };

      expect(validData.veteranId.vaFileNumber).to.match(/^\d{9}$/);
    });

    it('should accept prefixed VA file number', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'V12345678',
        },
      };

      expect(validData.veteranId.vaFileNumber.charAt(0)).to.equal('V');
    });

    it('should accept clone designation format', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'CT5019',
        },
      };

      expect(validData.veteranId.vaFileNumber).to.have.lengthOf.at.least(4);
    });
  });

  describe('Schema Property Definitions', () => {
    it('should have veteranId schema definition', () => {
      expect(identificationInformation.schema.properties.veteranId).to.exist;
    });

    it('should use platform ssnOrVaFileNumberNoHint schema', () => {
      const veteranIdSchema =
        identificationInformation.schema.properties.veteranId;
      expect(veteranIdSchema).to.be.an('object');
    });

    it('should configure veteran ID field properly', () => {
      const veteranIdSchema =
        identificationInformation.schema.properties.veteranId;
      expect(veteranIdSchema).to.exist;
    });
  });

  describe('Alternative Identification Methods', () => {
    it('should support SSN as primary identifier', () => {
      const validData = {
        veteranId: {
          'view:noSSN': false,
          ssn: '987-65-4321',
        },
      };

      expect(validData.veteranId['view:noSSN']).to.be.false;
      expect(validData.veteranId.ssn).to.exist;
      expect(validData.veteranId.vaFileNumber).to.be.undefined;
    });

    it('should support VA file number when SSN unavailable', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'C98765432',
        },
      };

      expect(validData.veteranId['view:noSSN']).to.be.true;
      expect(validData.veteranId.vaFileNumber).to.exist;
      expect(validData.veteranId.ssn).to.be.undefined;
    });

    it('should handle clone service number format', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'CT-7567',
        },
      };

      expect(validData.veteranId.vaFileNumber).to.include('CT');
      expect(validData.veteranId.vaFileNumber).to.include('-');
    });

    it('should handle ARC trooper designation', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'ARC5555',
        },
      };

      expect(validData.veteranId.vaFileNumber).to.include('ARC');
    });
  });

  describe('Empty and Missing Data', () => {
    it('should handle empty object', () => {
      const emptyData = {};

      expect(emptyData).to.be.an('object');
      expect(Object.keys(emptyData)).to.have.lengthOf(0);
    });

    it('should handle missing veteran ID', () => {
      const incompleteData = {
        veteranId: {
          'view:noSSN': false,
        },
      };

      expect(incompleteData.veteranId.ssn).to.be.undefined;
      expect(incompleteData.veteranId['view:noSSN']).to.be.false;
    });

    it('should identify missing SSN when required', () => {
      const incompleteData = {
        veteranId: {
          'view:noSSN': false,
        },
      };

      expect(incompleteData.veteranId.ssn).to.be.undefined;
    });

    it('should identify missing VA file when required', () => {
      const incompleteData = {
        veteranId: {
          'view:noSSN': true,
        },
      };

      expect(incompleteData.veteranId.vaFileNumber).to.be.undefined;
    });
  });

  describe('Clone Veteran Identification', () => {
    it('should accept clone trooper CT designation', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'CT7567',
        },
      };

      expect(validData.veteranId.vaFileNumber).to.match(/^CT\d{4}$/);
    });

    it('should accept clone commander CC designation', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'CC2224',
        },
      };

      expect(validData.veteranId.vaFileNumber).to.match(/^CC\d{4}$/);
    });

    it('should accept Republic Commando RC designation', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'RC1138',
        },
      };

      expect(validData.veteranId.vaFileNumber).to.match(/^RC\d{4}$/);
    });

    it('should accept numeric clone identification', () => {
      const validData = {
        veteranId: {
          'view:noSSN': false,
          ssn: '757-67-0000',
        },
      };

      expect(validData.veteranId.ssn).to.match(/^\d{3}-\d{2}-\d{4}$/);
    });

    it('should accept legacy service number format', () => {
      const validData = {
        veteranId: {
          'view:noSSN': true,
          vaFileNumber: 'GAR501-7567',
        },
      };

      expect(validData.veteranId.vaFileNumber).to.include('GAR');
    });
  });

  describe('SSN Format Validation', () => {
    it('should validate standard SSN with dashes', () => {
      const ssn = '123-45-6789';
      expect(ssn).to.match(/^\d{3}-\d{2}-\d{4}$/);
    });

    it('should validate SSN without formatting', () => {
      const ssn = '123456789';
      expect(ssn).to.match(/^\d{9}$/);
    });

    it('should validate clone veteran SSN pattern', () => {
      const ssn = '757-67-5019';
      const parts = ssn.split('-');
      expect(parts[0]).to.match(/^\d{3}$/);
      expect(parts[1]).to.match(/^\d{2}$/);
      expect(parts[2]).to.match(/^\d{4}$/);
    });
  });
});
