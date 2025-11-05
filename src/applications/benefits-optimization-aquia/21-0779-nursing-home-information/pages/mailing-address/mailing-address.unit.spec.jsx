import { expect } from 'chai';

import { mailingAddress } from '@bio-aquia/21-0779-nursing-home-information/pages/mailing-address/mailing-address';

describe('Mailing Address Page Schema', () => {
  describe('Schema Export', () => {
    it('should export mailingAddress as an object', () => {
      expect(mailingAddress).to.exist;
      expect(mailingAddress).to.be.an('object');
    });

    it('should have uiSchema property', () => {
      expect(mailingAddress.uiSchema).to.exist;
      expect(mailingAddress.uiSchema).to.be.an('object');
    });

    it('should have schema property', () => {
      expect(mailingAddress.schema).to.exist;
      expect(mailingAddress.schema).to.be.an('object');
    });
  });

  describe('UI Schema', () => {
    it('should have address field in uiSchema', () => {
      expect(mailingAddress.uiSchema.address).to.exist;
    });

    it('should have title configuration in uiSchema', () => {
      expect(mailingAddress.uiSchema['ui:title']).to.exist;
    });

    it('should configure title and description for mailing address', () => {
      expect(mailingAddress.uiSchema['ui:title']).to.exist;
    });
  });

  describe('Data Schema', () => {
    it('should have type object in schema', () => {
      expect(mailingAddress.schema.type).to.equal('object');
    });

    it('should have properties in schema', () => {
      expect(mailingAddress.schema.properties).to.exist;
      expect(mailingAddress.schema.properties).to.be.an('object');
    });

    it('should have address property in schema', () => {
      expect(mailingAddress.schema.properties.address).to.exist;
    });

    it('should configure address to omit street3', () => {
      const addressSchema = mailingAddress.schema.properties.address;
      expect(addressSchema).to.exist;
    });
  });
});
