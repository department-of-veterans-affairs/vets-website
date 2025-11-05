import { expect } from 'chai';
import {
  nursingOfficialFirstNameSchema,
  nursingOfficialLastNameSchema,
  nursingOfficialJobTitleSchema,
  nursingOfficialPhoneNumberSchema,
  nursingOfficialInformationSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/nursing-official-information/nursing-official-information';

describe('Nursing Official Information Schemas', () => {
  describe('nursingOfficialFirstNameSchema', () => {
    it('should validate valid first name', () => {
      const result = nursingOfficialFirstNameSchema.safeParse('John');
      expect(result.success).to.be.true;
    });

    it('should validate first name with hyphen', () => {
      const result = nursingOfficialFirstNameSchema.safeParse('Mary-Ann');
      expect(result.success).to.be.true;
    });

    it('should validate first name with apostrophe', () => {
      const result = nursingOfficialFirstNameSchema.safeParse("O'Brien");
      expect(result.success).to.be.true;
    });

    it('should validate first name with spaces', () => {
      const result = nursingOfficialFirstNameSchema.safeParse('Mary Jo');
      expect(result.success).to.be.true;
    });

    it('should validate first name at max length', () => {
      const result = nursingOfficialFirstNameSchema.safeParse('A'.repeat(30));
      expect(result.success).to.be.true;
    });

    it('should reject empty first name', () => {
      const result = nursingOfficialFirstNameSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'First name is required',
        );
      }
    });

    it('should reject first name over 30 characters', () => {
      const result = nursingOfficialFirstNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'must be less than 30 characters',
        );
      }
    });

    it('should reject first name with numbers', () => {
      const result = nursingOfficialFirstNameSchema.safeParse('John123');
      expect(result.success).to.be.false;
    });

    it('should reject first name with special characters', () => {
      const result = nursingOfficialFirstNameSchema.safeParse('John@Doe');
      expect(result.success).to.be.false;
    });

    it('should reject null first name', () => {
      const result = nursingOfficialFirstNameSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined first name', () => {
      const result = nursingOfficialFirstNameSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });
  });

  describe('nursingOfficialLastNameSchema', () => {
    it('should validate valid last name', () => {
      const result = nursingOfficialLastNameSchema.safeParse('Smith');
      expect(result.success).to.be.true;
    });

    it('should validate last name with hyphen', () => {
      const result = nursingOfficialLastNameSchema.safeParse('Smith-Jones');
      expect(result.success).to.be.true;
    });

    it('should validate last name with apostrophe', () => {
      const result = nursingOfficialLastNameSchema.safeParse("O'Connor");
      expect(result.success).to.be.true;
    });

    it('should validate last name with spaces', () => {
      const result = nursingOfficialLastNameSchema.safeParse('Van Der Berg');
      expect(result.success).to.be.true;
    });

    it('should validate last name at max length', () => {
      const result = nursingOfficialLastNameSchema.safeParse('B'.repeat(30));
      expect(result.success).to.be.true;
    });

    it('should reject empty last name', () => {
      const result = nursingOfficialLastNameSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Last name is required',
        );
      }
    });

    it('should reject last name over 30 characters', () => {
      const result = nursingOfficialLastNameSchema.safeParse('B'.repeat(31));
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'must be less than 30 characters',
        );
      }
    });

    it('should reject last name with numbers', () => {
      const result = nursingOfficialLastNameSchema.safeParse('Smith123');
      expect(result.success).to.be.false;
    });

    it('should reject last name with special characters', () => {
      const result = nursingOfficialLastNameSchema.safeParse('Smith@');
      expect(result.success).to.be.false;
    });

    it('should reject null last name', () => {
      const result = nursingOfficialLastNameSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined last name', () => {
      const result = nursingOfficialLastNameSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });
  });

  describe('nursingOfficialJobTitleSchema', () => {
    it('should validate valid job title', () => {
      const result = nursingOfficialJobTitleSchema.safeParse(
        'Nursing Director',
      );
      expect(result.success).to.be.true;
    });

    it('should validate job title with numbers', () => {
      const result = nursingOfficialJobTitleSchema.safeParse('Level 3 RN');
      expect(result.success).to.be.true;
    });

    it('should validate job title with special characters', () => {
      const result = nursingOfficialJobTitleSchema.safeParse(
        'Director of Nursing (RN)',
      );
      expect(result.success).to.be.true;
    });

    it('should validate job title at max length', () => {
      const result = nursingOfficialJobTitleSchema.safeParse('T'.repeat(100));
      expect(result.success).to.be.true;
    });

    it('should reject empty job title', () => {
      const result = nursingOfficialJobTitleSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Job title is required',
        );
      }
    });

    it('should reject job title over 100 characters', () => {
      const result = nursingOfficialJobTitleSchema.safeParse('T'.repeat(101));
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'must be less than 100 characters',
        );
      }
    });

    it('should reject null job title', () => {
      const result = nursingOfficialJobTitleSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined job title', () => {
      const result = nursingOfficialJobTitleSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });
  });

  describe('nursingOfficialPhoneNumberSchema', () => {
    it('should validate 10-digit phone number', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse('5551234567');
      expect(result.success).to.be.true;
    });

    it('should reject phone number with dashes (requires digits only)', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse('555-123-4567');
      expect(result.success).to.be.false;
    });

    it('should reject phone number with parentheses (requires digits only)', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse(
        '(555) 123-4567',
      );
      expect(result.success).to.be.false;
    });

    it('should reject phone number with spaces (requires digits only)', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse('555 123 4567');
      expect(result.success).to.be.false;
    });

    it('should reject phone number with mixed formatting (requires digits only)', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse(
        '(555)-123 4567',
      );
      expect(result.success).to.be.false;
    });

    it('should reject empty phone number', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Phone number is required',
        );
      }
    });

    it('should reject phone number with too few digits', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse('555123456');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('10 digits');
      }
    });

    it('should reject phone number with too many digits', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse('55512345678');
      expect(result.success).to.be.false;
    });

    it('should reject phone number with letters', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse('555-123-ABCD');
      expect(result.success).to.be.false;
    });

    it('should reject null phone number', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined phone number', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should reject numeric phone number', () => {
      const result = nursingOfficialPhoneNumberSchema.safeParse(5551234567);
      expect(result.success).to.be.false;
    });
  });

  describe('nursingOfficialInformationSchema', () => {
    it('should validate complete nursing official information', () => {
      const validData = {
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: 'Director of Nursing',
        phoneNumber: '5551234567',
      };
      const result = nursingOfficialInformationSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with special characters in name', () => {
      const validData = {
        firstName: 'Mary-Ann',
        lastName: "O'Brien-Jones",
        jobTitle: 'RN Supervisor',
        phoneNumber: '5551234567',
      };
      const result = nursingOfficialInformationSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with complex job title', () => {
      const validData = {
        firstName: 'Robert',
        lastName: 'Johnson',
        jobTitle: 'Senior Registered Nurse (Level 3) - Night Shift Coordinator',
        phoneNumber: '5551234567',
      };
      const result = nursingOfficialInformationSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing firstName', () => {
      const invalidData = {
        lastName: 'Smith',
        jobTitle: 'Director',
        phoneNumber: '555-123-4567',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty firstName', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Smith',
        jobTitle: 'Director',
        phoneNumber: '555-123-4567',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing lastName', () => {
      const invalidData = {
        firstName: 'Jane',
        jobTitle: 'Director',
        phoneNumber: '555-123-4567',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty lastName', () => {
      const invalidData = {
        firstName: 'Jane',
        lastName: '',
        jobTitle: 'Director',
        phoneNumber: '555-123-4567',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing jobTitle', () => {
      const invalidData = {
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '555-123-4567',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty jobTitle', () => {
      const invalidData = {
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: '',
        phoneNumber: '555-123-4567',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing phoneNumber', () => {
      const invalidData = {
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: 'Director',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty phoneNumber', () => {
      const invalidData = {
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: 'Director',
        phoneNumber: '',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid phone number format', () => {
      const invalidData = {
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: 'Director',
        phoneNumber: '123',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject firstName with numbers', () => {
      const invalidData = {
        firstName: 'Jane123',
        lastName: 'Smith',
        jobTitle: 'Director',
        phoneNumber: '555-123-4567',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject lastName with special characters', () => {
      const invalidData = {
        firstName: 'Jane',
        lastName: 'Smith@',
        jobTitle: 'Director',
        phoneNumber: '555-123-4567',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty object', () => {
      const invalidData = {};
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject with multiple invalid fields and provide all errors', () => {
      const invalidData = {
        firstName: '',
        lastName: '',
        jobTitle: '',
        phoneNumber: '123',
      };
      const result = nursingOfficialInformationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues.length).to.be.greaterThan(1);
      }
    });
  });
});
