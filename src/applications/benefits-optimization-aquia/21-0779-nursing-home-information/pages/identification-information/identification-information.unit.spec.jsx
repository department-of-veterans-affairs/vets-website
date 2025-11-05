import { expect } from 'chai';

import { identificationInformation } from '@bio-aquia/21-0779-nursing-home-information/pages/identification-information/identification-information';

describe('Identification Information Page Schema', () => {
  describe('Schema Export', () => {
    it('should export identificationInformation as an object', () => {
      expect(identificationInformation).to.exist;
      expect(identificationInformation).to.be.an('object');
    });

    it('should have uiSchema property', () => {
      expect(identificationInformation.uiSchema).to.exist;
      expect(identificationInformation.uiSchema).to.be.an('object');
    });

    it('should have schema property', () => {
      expect(identificationInformation.schema).to.exist;
      expect(identificationInformation.schema).to.be.an('object');
    });
  });

  describe('UI Schema', () => {
    it('should have veteranId field in uiSchema', () => {
      expect(identificationInformation.uiSchema.veteranId).to.exist;
    });

    it('should have title configuration in uiSchema', () => {
      expect(identificationInformation.uiSchema['ui:title']).to.exist;
    });

    it('should configure title and description for identification', () => {
      expect(identificationInformation.uiSchema['ui:title']).to.exist;
    });
  });

  describe('Data Schema', () => {
    it('should have type object in schema', () => {
      expect(identificationInformation.schema.type).to.equal('object');
    });

    it('should have properties in schema', () => {
      expect(identificationInformation.schema.properties).to.exist;
      expect(identificationInformation.schema.properties).to.be.an('object');
    });

    it('should have veteranId property in schema', () => {
      expect(identificationInformation.schema.properties.veteranId).to.exist;
    });

    it('should configure veteranId for SSN or VA file number', () => {
      const veteranIdSchema =
        identificationInformation.schema.properties.veteranId;
      expect(veteranIdSchema).to.exist;
    });
  });
});
