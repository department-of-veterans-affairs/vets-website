import { expect } from 'chai';

import { nameAndDateOfBirth } from '@bio-aquia/21-0779-nursing-home-information/pages/name-and-date-of-birth/name-and-date-of-birth';

describe('Name and Date of Birth Page Schema', () => {
  describe('Schema Structure', () => {
    it('should export a page schema object', () => {
      expect(nameAndDateOfBirth).to.exist;
      expect(nameAndDateOfBirth).to.be.an('object');
    });

    it('should have uiSchema property', () => {
      expect(nameAndDateOfBirth.uiSchema).to.exist;
      expect(nameAndDateOfBirth.uiSchema).to.be.an('object');
    });

    it('should have schema property', () => {
      expect(nameAndDateOfBirth.schema).to.exist;
      expect(nameAndDateOfBirth.schema).to.be.an('object');
    });
  });

  describe('UI Schema Configuration', () => {
    it('should have fullName field configuration', () => {
      expect(nameAndDateOfBirth.uiSchema.fullName).to.exist;
    });

    it('should have dateOfBirth field configuration', () => {
      expect(nameAndDateOfBirth.uiSchema.dateOfBirth).to.exist;
    });

    it('should have title configuration', () => {
      expect(nameAndDateOfBirth.uiSchema['ui:title']).to.exist;
    });
  });

  describe('Data Schema Configuration', () => {
    it('should be an object type', () => {
      expect(nameAndDateOfBirth.schema.type).to.equal('object');
    });

    it('should have properties defined', () => {
      expect(nameAndDateOfBirth.schema.properties).to.exist;
      expect(nameAndDateOfBirth.schema.properties).to.be.an('object');
    });

    it('should have fullName property', () => {
      expect(nameAndDateOfBirth.schema.properties.fullName).to.exist;
    });

    it('should have dateOfBirth property', () => {
      expect(nameAndDateOfBirth.schema.properties.dateOfBirth).to.exist;
    });
  });

  describe('Required Fields', () => {
    it('should have required array', () => {
      expect(nameAndDateOfBirth.schema.required).to.exist;
      expect(nameAndDateOfBirth.schema.required).to.be.an('array');
    });

    it('should require fullName', () => {
      expect(nameAndDateOfBirth.schema.required).to.include('fullName');
    });

    it('should require dateOfBirth', () => {
      expect(nameAndDateOfBirth.schema.required).to.include('dateOfBirth');
    });

    it('should have exactly 2 required fields', () => {
      expect(nameAndDateOfBirth.schema.required.length).to.equal(2);
    });
  });

  describe('Field Count', () => {
    it('should have exactly 2 form fields defined', () => {
      const propertyKeys = Object.keys(
        nameAndDateOfBirth.schema.properties,
      ).filter(key => !key.startsWith('ui:'));
      expect(propertyKeys.length).to.equal(2);
    });
  });
});
