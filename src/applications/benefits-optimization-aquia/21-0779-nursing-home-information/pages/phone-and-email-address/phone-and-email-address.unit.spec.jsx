import { expect } from 'chai';

import { phoneAndEmailAddress } from '@bio-aquia/21-0779-nursing-home-information/pages/phone-and-email-address/phone-and-email-address';

describe('Phone and Email Address Page Schema', () => {
  describe('Schema Export', () => {
    it('should export phoneAndEmailAddress as an object', () => {
      expect(phoneAndEmailAddress).to.exist;
      expect(phoneAndEmailAddress).to.be.an('object');
    });

    it('should have uiSchema property', () => {
      expect(phoneAndEmailAddress.uiSchema).to.exist;
      expect(phoneAndEmailAddress.uiSchema).to.be.an('object');
    });

    it('should have schema property', () => {
      expect(phoneAndEmailAddress.schema).to.exist;
      expect(phoneAndEmailAddress.schema).to.be.an('object');
    });
  });

  describe('UI Schema', () => {
    it('should have homePhone field in uiSchema', () => {
      expect(phoneAndEmailAddress.uiSchema.homePhone).to.exist;
    });

    it('should have mobilePhone field in uiSchema', () => {
      expect(phoneAndEmailAddress.uiSchema.mobilePhone).to.exist;
    });

    it('should have emailAddress field in uiSchema', () => {
      expect(phoneAndEmailAddress.uiSchema.emailAddress).to.exist;
    });

    it('should have title configuration in uiSchema', () => {
      expect(phoneAndEmailAddress.uiSchema['ui:title']).to.exist;
    });
  });

  describe('Data Schema', () => {
    it('should have type object in schema', () => {
      expect(phoneAndEmailAddress.schema.type).to.equal('object');
    });

    it('should have properties in schema', () => {
      expect(phoneAndEmailAddress.schema.properties).to.exist;
      expect(phoneAndEmailAddress.schema.properties).to.be.an('object');
    });

    it('should have homePhone property in schema', () => {
      expect(phoneAndEmailAddress.schema.properties.homePhone).to.exist;
    });

    it('should have mobilePhone property in schema', () => {
      expect(phoneAndEmailAddress.schema.properties.mobilePhone).to.exist;
    });

    it('should have emailAddress property in schema', () => {
      expect(phoneAndEmailAddress.schema.properties.emailAddress).to.exist;
    });

    it('should require homePhone field', () => {
      expect(phoneAndEmailAddress.schema.required).to.exist;
      expect(phoneAndEmailAddress.schema.required).to.include('homePhone');
    });

    it('should have exactly one required field', () => {
      expect(phoneAndEmailAddress.schema.required).to.have.lengthOf(1);
    });
  });
});
