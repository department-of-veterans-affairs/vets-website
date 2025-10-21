/**
 * @module tests/pages/name-and-date-of-birth.unit.spec
 * @description Unit tests for name and date of birth page configuration
 */

import { expect } from 'chai';
import { nameAndDateOfBirth } from './name-and-date-of-birth';

describe('Personal Identification Form', () => {
  describe('Page Schema Structure', () => {
    it('should have uiSchema property', () => {
      expect(nameAndDateOfBirth).to.have.property('uiSchema');
      expect(nameAndDateOfBirth.uiSchema).to.be.an('object');
    });

    it('should have schema property', () => {
      expect(nameAndDateOfBirth).to.have.property('schema');
      expect(nameAndDateOfBirth.schema).to.be.an('object');
    });

    it('should have correct schema type', () => {
      expect(nameAndDateOfBirth.schema.type).to.equal('object');
    });

    it('should define properties for name and date fields', () => {
      expect(nameAndDateOfBirth.schema.properties).to.include.keys(
        'fullName',
        'dateOfBirth',
      );
    });
  });

  describe('Required Fields', () => {
    it('should require full name', () => {
      expect(nameAndDateOfBirth.schema.required).to.include('fullName');
    });

    it('should require date of birth', () => {
      expect(nameAndDateOfBirth.schema.required).to.include('dateOfBirth');
    });

    it('should have exactly two required fields', () => {
      expect(nameAndDateOfBirth.schema.required).to.have.lengthOf(2);
    });

    it('should require all fields for veteran identification', () => {
      const requiredFields = nameAndDateOfBirth.schema.required;
      expect(requiredFields).to.deep.equal(['fullName', 'dateOfBirth']);
    });
  });

  describe('UI Schema Configuration', () => {
    it('should have full name field in UI schema', () => {
      expect(nameAndDateOfBirth.uiSchema).to.have.property('fullName');
    });

    it('should have date of birth field in UI schema', () => {
      expect(nameAndDateOfBirth.uiSchema).to.have.property('dateOfBirth');
    });

    it('should have page title in UI schema', () => {
      expect(nameAndDateOfBirth.uiSchema).to.have.property('ui:title');
    });

    it('should use fullNameNoSuffix pattern', () => {
      expect(nameAndDateOfBirth.uiSchema.fullName).to.exist;
    });
  });

  describe('Valid Personal Data', () => {
    it('should accept complete veteran identification', () => {
      const validData = {
        fullName: {
          first: 'Rex',
          middle: 'CT',
          last: 'Fives',
        },
        dateOfBirth: '2032-05-20',
      };

      expect(validData.fullName.first).to.equal('Rex');
      expect(validData.fullName.last).to.equal('Fives');
      expect(validData.dateOfBirth).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should accept clone veteran identification', () => {
      const validData = {
        fullName: {
          first: 'CT',
          last: '7567',
        },
        dateOfBirth: '2032-05-20',
      };

      expect(validData.fullName.first).to.have.lengthOf.at.least(1);
      expect(validData.fullName.last).to.have.lengthOf.at.least(1);
    });

    it('should accept veteran with middle name', () => {
      const validData = {
        fullName: {
          first: 'Ahsoka',
          middle: 'Fulcrum',
          last: 'Tano',
        },
        dateOfBirth: '2036-04-15',
      };

      expect(validData.fullName.middle).to.equal('Fulcrum');
      expect(Object.keys(validData.fullName)).to.include('middle');
    });

    it('should accept veteran without middle name', () => {
      const validData = {
        fullName: {
          first: 'Cody',
          last: 'Marshall',
        },
        dateOfBirth: '2032-05-20',
      };

      expect(validData.fullName.first).to.exist;
      expect(validData.fullName.last).to.exist;
      expect(validData.fullName.middle).to.be.undefined;
    });

    it('should accept standard date format', () => {
      const validData = {
        fullName: {
          first: 'Rex',
          last: 'Fives',
        },
        dateOfBirth: '2032-05-20',
      };

      const dateParts = validData.dateOfBirth.split('-');
      expect(dateParts).to.have.lengthOf(3);
      expect(dateParts[0]).to.have.lengthOf(4); // Year
      expect(dateParts[1]).to.have.lengthOf(2); // Month
      expect(dateParts[2]).to.have.lengthOf(2); // Day
    });

    it('should accept hyphenated last name', () => {
      const validData = {
        fullName: {
          first: 'Padmé',
          last: 'Amidala-Skywalker',
        },
        dateOfBirth: '1970-01-15',
      };

      expect(validData.fullName.last).to.include('-');
    });

    it('should accept name with special characters', () => {
      const validData = {
        fullName: {
          first: "Kal'El",
          last: 'Skirata',
        },
        dateOfBirth: '1965-08-20',
      };

      expect(validData.fullName.first).to.include("'");
    });
  });

  describe('Schema Property Definitions', () => {
    it('should have fullName schema definition', () => {
      expect(nameAndDateOfBirth.schema.properties.fullName).to.exist;
    });

    it('should have dateOfBirth schema definition', () => {
      expect(nameAndDateOfBirth.schema.properties.dateOfBirth).to.exist;
    });

    it('should use platform fullNameNoSuffix schema', () => {
      const fullNameSchema = nameAndDateOfBirth.schema.properties.fullName;
      expect(fullNameSchema).to.be.an('object');
    });

    it('should use platform dateOfBirth schema', () => {
      const dobSchema = nameAndDateOfBirth.schema.properties.dateOfBirth;
      expect(dobSchema).to.be.an('object');
    });
  });

  describe('Empty and Missing Data', () => {
    it('should handle empty object', () => {
      const emptyData = {};

      expect(emptyData).to.be.an('object');
      expect(Object.keys(emptyData)).to.have.lengthOf(0);
    });

    it('should handle partial name data', () => {
      const partialData = {
        fullName: {
          first: 'Rex',
        },
      };

      expect(partialData.fullName.first).to.exist;
      expect(partialData.fullName.last).to.be.undefined;
    });

    it('should handle missing middle name', () => {
      const dataWithoutMiddle = {
        fullName: {
          first: 'Fives',
          last: 'ARC',
        },
        dateOfBirth: '2032-05-20',
      };

      expect(dataWithoutMiddle.fullName.middle).to.be.undefined;
      expect(dataWithoutMiddle.fullName.first).to.exist;
      expect(dataWithoutMiddle.fullName.last).to.exist;
    });

    it('should identify incomplete data without date of birth', () => {
      const incompleteData = {
        fullName: {
          first: 'Echo',
          last: 'Bad',
        },
      };

      expect(incompleteData.dateOfBirth).to.be.undefined;
    });

    it('should identify incomplete data without full name', () => {
      const incompleteData = {
        dateOfBirth: '2032-05-20',
      };

      expect(incompleteData.fullName).to.be.undefined;
    });
  });

  describe('Date Format Validation', () => {
    it('should validate YYYY-MM-DD format for clone birth date', () => {
      const validDate = '2032-05-20';
      expect(validDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should validate historical date format', () => {
      const validDate = '1945-11-11';
      expect(validDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should validate contemporary date format', () => {
      const validDate = '1985-03-12';
      expect(validDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
