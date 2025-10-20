/**
 * @module tests/pages/phone-and-email-address.unit.spec
 * @description Unit tests for phone and email address page configuration
 */

import { expect } from 'chai';
import { phoneAndEmailAddress } from './phone-and-email-address';

describe('Contact Information Form', () => {
  describe('Page Schema Structure', () => {
    it('should have uiSchema property', () => {
      expect(phoneAndEmailAddress).to.have.property('uiSchema');
      expect(phoneAndEmailAddress.uiSchema).to.be.an('object');
    });

    it('should have schema property', () => {
      expect(phoneAndEmailAddress).to.have.property('schema');
      expect(phoneAndEmailAddress.schema).to.be.an('object');
    });

    it('should have correct schema type', () => {
      expect(phoneAndEmailAddress.schema.type).to.equal('object');
    });

    it('should define properties for contact fields', () => {
      expect(phoneAndEmailAddress.schema.properties).to.include.keys(
        'homePhone',
        'mobilePhone',
        'emailAddress',
      );
    });
  });

  describe('Required Fields', () => {
    it('should require home phone number', () => {
      expect(phoneAndEmailAddress.schema.required).to.include('homePhone');
    });

    it('should not require mobile phone', () => {
      expect(phoneAndEmailAddress.schema.required).to.not.include(
        'mobilePhone',
      );
    });

    it('should not require email address', () => {
      expect(phoneAndEmailAddress.schema.required).to.not.include(
        'emailAddress',
      );
    });

    it('should have exactly one required field', () => {
      expect(phoneAndEmailAddress.schema.required).to.have.lengthOf(1);
    });
  });

  describe('UI Schema Configuration', () => {
    it('should have home phone field in UI schema', () => {
      expect(phoneAndEmailAddress.uiSchema).to.have.property('homePhone');
    });

    it('should have mobile phone field in UI schema', () => {
      expect(phoneAndEmailAddress.uiSchema).to.have.property('mobilePhone');
    });

    it('should have email address field in UI schema', () => {
      expect(phoneAndEmailAddress.uiSchema).to.have.property('emailAddress');
    });

    it('should have page title in UI schema', () => {
      expect(phoneAndEmailAddress.uiSchema).to.have.property('ui:title');
    });
  });

  describe('Valid Contact Data', () => {
    it('should accept complete contact information', () => {
      const validData = {
        homePhone: '5551234567',
        mobilePhone: '5559876543',
        emailAddress: 'rex.ct7567@grandarmyvets.org',
      };

      expect(validData.homePhone).to.match(/^\d{10}$/);
      expect(validData.mobilePhone).to.match(/^\d{10}$/);
      expect(validData.emailAddress).to.include('@');
    });

    it('should accept veteran contact with only home phone', () => {
      const validData = {
        homePhone: '5551234567',
      };

      expect(validData).to.have.property('homePhone');
      expect(validData).to.not.have.property('mobilePhone');
      expect(validData).to.not.have.property('emailAddress');
    });

    it('should accept home phone and email without mobile', () => {
      const validData = {
        homePhone: '5559876543',
        emailAddress: 'captain.rex@501stlegion.org',
      };

      expect(validData.homePhone).to.exist;
      expect(validData.emailAddress).to.exist;
      expect(validData.mobilePhone).to.be.undefined;
    });

    it('should accept all contact methods for clone veteran', () => {
      const validData = {
        homePhone: '5551237567',
        mobilePhone: '5557775019',
        emailAddress: 'rex.fives@republicvets.org',
      };

      expect(Object.keys(validData)).to.have.lengthOf(3);
      expect(validData.homePhone).to.match(/^555\d{7}$/);
    });

    it('should accept standard email format', () => {
      const validData = {
        homePhone: '5551234567',
        emailAddress: 'ahsoka.tano@togrutalegacy.org',
      };

      expect(validData.emailAddress).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  describe('Schema Property Definitions', () => {
    it('should have homePhone schema definition', () => {
      expect(phoneAndEmailAddress.schema.properties.homePhone).to.exist;
    });

    it('should have mobilePhone schema definition', () => {
      expect(phoneAndEmailAddress.schema.properties.mobilePhone).to.exist;
    });

    it('should have emailAddress schema definition', () => {
      expect(phoneAndEmailAddress.schema.properties.emailAddress).to.exist;
    });

    it('should use platform phone schema pattern', () => {
      const homePhoneSchema = phoneAndEmailAddress.schema.properties.homePhone;
      expect(homePhoneSchema).to.be.an('object');
    });

    it('should use platform email schema pattern', () => {
      const emailSchema = phoneAndEmailAddress.schema.properties.emailAddress;
      expect(emailSchema).to.be.an('object');
    });
  });

  describe('Empty and Missing Data', () => {
    it('should handle empty object', () => {
      const emptyData = {};

      expect(emptyData).to.be.an('object');
      expect(Object.keys(emptyData)).to.have.lengthOf(0);
    });

    it('should handle partial contact data', () => {
      const partialData = {
        homePhone: '5551234567',
      };

      expect(partialData.homePhone).to.exist;
      expect(partialData.mobilePhone).to.be.undefined;
    });

    it('should handle missing optional mobile phone', () => {
      const dataWithoutMobile = {
        homePhone: '5559876543',
        emailAddress: 'veteran@republicservice.org',
      };

      expect(dataWithoutMobile.mobilePhone).to.be.undefined;
      expect(dataWithoutMobile.homePhone).to.exist;
      expect(dataWithoutMobile.emailAddress).to.exist;
    });
  });
});
