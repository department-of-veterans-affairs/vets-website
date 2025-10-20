/**
 * @module tests/schemas/claimant-identification.unit.spec
 * @description Unit tests for claimant identification validation schemas
 */

import { expect } from 'chai';
import {
  claimantFirstNameSchema,
  claimantMiddleNameSchema,
  claimantLastNameSchema,
  claimantStreetAddressSchema,
  claimantUnitNumberSchema,
  claimantCitySchema,
  claimantStateSchema,
  claimantZipSchema,
  claimantPhoneSchema,
  claimantRelationshipSchema,
  claimantRelationshipOtherSchema,
  claimantIdentificationSchema,
} from './claimant-identification';

describe('Claimant Identification Validation Schemas', () => {
  describe('claimantFirstNameSchema', () => {
    it('should validate valid first name', () => {
      const result = claimantFirstNameSchema.safeParse('Ahsoka');
      expect(result.success).to.be.true;
    });

    it('should validate first name with hyphen', () => {
      const result = claimantFirstNameSchema.safeParse('Ahsoka-Tano');
      expect(result.success).to.be.true;
    });

    it('should validate first name with apostrophe', () => {
      const result = claimantFirstNameSchema.safeParse("Kal'El");
      expect(result.success).to.be.true;
    });

    it('should reject empty first name', () => {
      const result = claimantFirstNameSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('First name is required');
    });

    it('should reject first name over 30 characters', () => {
      const result = claimantFirstNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });

    it('should reject first name with numbers', () => {
      const result = claimantFirstNameSchema.safeParse('John123');
      expect(result.success).to.be.false;
    });
  });

  describe('claimantMiddleNameSchema', () => {
    it('should validate valid middle name', () => {
      const result = claimantMiddleNameSchema.safeParse('Fulcrum');
      expect(result.success).to.be.true;
    });

    it('should validate empty middle name', () => {
      const result = claimantMiddleNameSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined middle name', () => {
      const result = claimantMiddleNameSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should reject middle name over 30 characters', () => {
      const result = claimantMiddleNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });
  });

  describe('claimantLastNameSchema', () => {
    it('should validate valid last name', () => {
      const result = claimantLastNameSchema.safeParse('Tano');
      expect(result.success).to.be.true;
    });

    it('should validate last name with hyphen', () => {
      const result = claimantLastNameSchema.safeParse('Organa-Solo');
      expect(result.success).to.be.true;
    });

    it('should reject empty last name', () => {
      const result = claimantLastNameSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('Last name is required');
    });

    it('should reject last name over 30 characters', () => {
      const result = claimantLastNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });
  });

  describe('claimantStreetAddressSchema', () => {
    it('should validate valid street address', () => {
      const result = claimantStreetAddressSchema.safeParse('123 Main St');
      expect(result.success).to.be.true;
    });

    it('should validate street address at max length', () => {
      const result = claimantStreetAddressSchema.safeParse('A'.repeat(50));
      expect(result.success).to.be.true;
    });

    it('should reject empty street address', () => {
      const result = claimantStreetAddressSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Street address is required',
      );
    });

    it('should reject street address over 50 characters', () => {
      const result = claimantStreetAddressSchema.safeParse('A'.repeat(51));
      expect(result.success).to.be.false;
    });
  });

  describe('claimantUnitNumberSchema', () => {
    it('should validate valid unit number', () => {
      const result = claimantUnitNumberSchema.safeParse('Apt 2');
      expect(result.success).to.be.true;
    });

    it('should validate empty unit number', () => {
      const result = claimantUnitNumberSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined unit number', () => {
      const result = claimantUnitNumberSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should reject unit number over 10 characters', () => {
      const result = claimantUnitNumberSchema.safeParse('A'.repeat(11));
      expect(result.success).to.be.false;
    });

    it('should validate unit number at max length', () => {
      const result = claimantUnitNumberSchema.safeParse('A'.repeat(10));
      expect(result.success).to.be.true;
    });
  });

  describe('claimantCitySchema', () => {
    it('should validate valid city', () => {
      const result = claimantCitySchema.safeParse('Mos Eisley');
      expect(result.success).to.be.true;
    });

    it('should validate city at max length', () => {
      const result = claimantCitySchema.safeParse('A'.repeat(30));
      expect(result.success).to.be.true;
    });

    it('should reject empty city', () => {
      const result = claimantCitySchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('City is required');
    });

    it('should reject city over 30 characters', () => {
      const result = claimantCitySchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });
  });

  describe('claimantStateSchema', () => {
    it('should validate valid state code', () => {
      const result = claimantStateSchema.safeParse('CA');
      expect(result.success).to.be.true;
    });

    it('should validate another state code', () => {
      const result = claimantStateSchema.safeParse('NY');
      expect(result.success).to.be.true;
    });

    it('should reject empty state', () => {
      const result = claimantStateSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject state code with 1 character', () => {
      const result = claimantStateSchema.safeParse('C');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('Please select a state');
    });

    it('should reject state code with 3 characters', () => {
      const result = claimantStateSchema.safeParse('CAL');
      expect(result.success).to.be.false;
    });
  });

  describe('claimantZipSchema', () => {
    it('should validate 5-digit ZIP code', () => {
      const result = claimantZipSchema.safeParse('94102');
      expect(result.success).to.be.true;
    });

    it('should validate 9-digit ZIP code', () => {
      const result = claimantZipSchema.safeParse('94102-1234');
      expect(result.success).to.be.true;
    });

    it('should reject empty ZIP code', () => {
      const result = claimantZipSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('ZIP code is required');
    });

    it('should reject invalid ZIP code', () => {
      const result = claimantZipSchema.safeParse('123');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('valid 5 or 9 digit');
    });

    it('should reject ZIP code with letters', () => {
      const result = claimantZipSchema.safeParse('ABCDE');
      expect(result.success).to.be.false;
    });
  });

  describe('claimantPhoneSchema', () => {
    it('should validate 10-digit phone number', () => {
      const result = claimantPhoneSchema.safeParse('4155551234');
      expect(result.success).to.be.true;
    });

    it('should validate phone with dashes', () => {
      const result = claimantPhoneSchema.safeParse('415-555-1234');
      expect(result.success).to.be.true;
    });

    it('should validate phone with parentheses', () => {
      const result = claimantPhoneSchema.safeParse('(415) 555-1234');
      expect(result.success).to.be.true;
    });

    it('should reject empty phone', () => {
      const result = claimantPhoneSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Phone number is required',
      );
    });

    it('should reject phone with too few digits', () => {
      const result = claimantPhoneSchema.safeParse('123456');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('10-digit');
    });

    it('should reject phone with too many digits', () => {
      const result = claimantPhoneSchema.safeParse('12345678901');
      expect(result.success).to.be.false;
    });
  });

  describe('claimantRelationshipSchema', () => {
    it('should validate spouse', () => {
      const result = claimantRelationshipSchema.safeParse('spouse');
      expect(result.success).to.be.true;
    });

    it('should validate child', () => {
      const result = claimantRelationshipSchema.safeParse('child');
      expect(result.success).to.be.true;
    });

    it('should validate parent', () => {
      const result = claimantRelationshipSchema.safeParse('parent');
      expect(result.success).to.be.true;
    });

    it('should validate guardian', () => {
      const result = claimantRelationshipSchema.safeParse('guardian');
      expect(result.success).to.be.true;
    });

    it('should validate fiduciary', () => {
      const result = claimantRelationshipSchema.safeParse('fiduciary');
      expect(result.success).to.be.true;
    });

    it('should validate other', () => {
      const result = claimantRelationshipSchema.safeParse('other');
      expect(result.success).to.be.true;
    });

    it('should reject invalid relationship', () => {
      const result = claimantRelationshipSchema.safeParse('friend');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'relationship to the Veteran',
      );
    });

    it('should reject empty relationship', () => {
      const result = claimantRelationshipSchema.safeParse('');
      expect(result.success).to.be.false;
    });
  });

  describe('claimantRelationshipOtherSchema', () => {
    it('should validate valid relationship description', () => {
      const result = claimantRelationshipOtherSchema.safeParse('Caregiver');
      expect(result.success).to.be.true;
    });

    it('should validate relationship at max length', () => {
      const result = claimantRelationshipOtherSchema.safeParse('A'.repeat(50));
      expect(result.success).to.be.true;
    });

    it('should reject empty relationship', () => {
      const result = claimantRelationshipOtherSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Please specify your relationship',
      );
    });

    it('should reject relationship over 50 characters', () => {
      const result = claimantRelationshipOtherSchema.safeParse('A'.repeat(51));
      expect(result.success).to.be.false;
    });
  });

  describe('claimantIdentificationSchema', () => {
    it('should validate complete claimant identification', () => {
      const data = {
        claimantFirstName: 'Cad',
        claimantMiddleName: '',
        claimantLastName: 'Bane',
        claimantStreetAddress: '123 Main St',
        claimantUnitNumber: '',
        claimantCity: 'Mos Eisley',
        claimantState: 'CA',
        claimantZip: '94102',
        claimantPhone: '4155551234',
        claimantRelationship: 'spouse',
        claimantRelationshipOther: '',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate with middle name and unit number', () => {
      const data = {
        claimantFirstName: 'Jango',
        claimantMiddleName: 'T',
        claimantLastName: 'Fett',
        claimantStreetAddress: '456 Oak Ave',
        claimantUnitNumber: 'Apt 2',
        claimantCity: 'Nar Shaddaa',
        claimantState: 'NY',
        claimantZip: '10001',
        claimantPhone: '2125551234',
        claimantRelationship: 'child',
        claimantRelationshipOther: '',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate with other relationship', () => {
      const data = {
        claimantFirstName: 'Jango',
        claimantMiddleName: '',
        claimantLastName: 'Fett',
        claimantStreetAddress: '456 Oak Ave',
        claimantUnitNumber: 'Apt 2',
        claimantCity: 'Nar Shaddaa',
        claimantState: 'NY',
        claimantZip: '10001',
        claimantPhone: '2125551234',
        claimantRelationship: 'other',
        claimantRelationshipOther: 'Caregiver',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject other relationship without description', () => {
      const data = {
        claimantFirstName: 'Jango',
        claimantMiddleName: '',
        claimantLastName: 'Fett',
        claimantStreetAddress: '456 Oak Ave',
        claimantUnitNumber: '',
        claimantCity: 'Nar Shaddaa',
        claimantState: 'NY',
        claimantZip: '10001',
        claimantPhone: '2125551234',
        claimantRelationship: 'other',
        claimantRelationshipOther: '',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Please specify your relationship',
      );
    });

    it('should reject missing first name', () => {
      const data = {
        claimantFirstName: '',
        claimantMiddleName: '',
        claimantLastName: 'Bane',
        claimantStreetAddress: '123 Main St',
        claimantUnitNumber: '',
        claimantCity: 'Mos Eisley',
        claimantState: 'CA',
        claimantZip: '94102',
        claimantPhone: '4155551234',
        claimantRelationship: 'spouse',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing last name', () => {
      const data = {
        claimantFirstName: 'Cad',
        claimantMiddleName: '',
        claimantLastName: '',
        claimantStreetAddress: '123 Main St',
        claimantUnitNumber: '',
        claimantCity: 'Mos Eisley',
        claimantState: 'CA',
        claimantZip: '94102',
        claimantPhone: '4155551234',
        claimantRelationship: 'spouse',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing street address', () => {
      const data = {
        claimantFirstName: 'Cad',
        claimantMiddleName: '',
        claimantLastName: 'Bane',
        claimantStreetAddress: '',
        claimantUnitNumber: '',
        claimantCity: 'Mos Eisley',
        claimantState: 'CA',
        claimantZip: '94102',
        claimantPhone: '4155551234',
        claimantRelationship: 'spouse',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing city', () => {
      const data = {
        claimantFirstName: 'Cad',
        claimantMiddleName: '',
        claimantLastName: 'Bane',
        claimantStreetAddress: '123 Main St',
        claimantUnitNumber: '',
        claimantCity: '',
        claimantState: 'CA',
        claimantZip: '94102',
        claimantPhone: '4155551234',
        claimantRelationship: 'spouse',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid state', () => {
      const data = {
        claimantFirstName: 'Cad',
        claimantMiddleName: '',
        claimantLastName: 'Bane',
        claimantStreetAddress: '123 Main St',
        claimantUnitNumber: '',
        claimantCity: 'Mos Eisley',
        claimantState: 'CAL',
        claimantZip: '94102',
        claimantPhone: '4155551234',
        claimantRelationship: 'spouse',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid ZIP code', () => {
      const data = {
        claimantFirstName: 'Cad',
        claimantMiddleName: '',
        claimantLastName: 'Bane',
        claimantStreetAddress: '123 Main St',
        claimantUnitNumber: '',
        claimantCity: 'Mos Eisley',
        claimantState: 'CA',
        claimantZip: '123',
        claimantPhone: '4155551234',
        claimantRelationship: 'spouse',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid phone', () => {
      const data = {
        claimantFirstName: 'Cad',
        claimantMiddleName: '',
        claimantLastName: 'Bane',
        claimantStreetAddress: '123 Main St',
        claimantUnitNumber: '',
        claimantCity: 'Mos Eisley',
        claimantState: 'CA',
        claimantZip: '94102',
        claimantPhone: '123',
        claimantRelationship: 'spouse',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should validate with 9-digit ZIP code', () => {
      const data = {
        claimantFirstName: 'Cad',
        claimantMiddleName: '',
        claimantLastName: 'Bane',
        claimantStreetAddress: '123 Main St',
        claimantUnitNumber: '',
        claimantCity: 'Mos Eisley',
        claimantState: 'CA',
        claimantZip: '94102-1234',
        claimantPhone: '4155551234',
        claimantRelationship: 'spouse',
      };
      const result = claimantIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate all relationship types', () => {
      const relationships = [
        'spouse',
        'child',
        'parent',
        'guardian',
        'fiduciary',
      ];

      relationships.forEach(relationship => {
        const data = {
          claimantFirstName: 'Test',
          claimantMiddleName: '',
          claimantLastName: 'User',
          claimantStreetAddress: '123 Main St',
          claimantUnitNumber: '',
          claimantCity: 'City',
          claimantState: 'CA',
          claimantZip: '94102',
          claimantPhone: '4155551234',
          claimantRelationship: relationship,
        };
        const result = claimantIdentificationSchema.safeParse(data);
        expect(result.success).to.be.true;
      });
    });
  });
});
