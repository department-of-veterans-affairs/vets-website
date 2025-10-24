/**
 * Unit tests for claimant contact schemas
 */

import { expect } from 'chai';
import {
  claimantPhoneNumberSchema,
  claimantMobilePhoneSchema,
  claimantEmailSchema,
  claimantContactPageSchema,
} from './claimant-contact';

describe('Claimant Contact Schemas', () => {
  describe('claimantPhoneNumberSchema', () => {
    it('should validate 10-digit phone number', () => {
      const result = claimantPhoneNumberSchema.safeParse('5551234567');
      expect(result.success).to.be.true;
    });

    it('should validate phone number with dashes', () => {
      const result = claimantPhoneNumberSchema.safeParse('555-123-4567');
      expect(result.success).to.be.true;
    });

    it('should validate phone number with parentheses', () => {
      const result = claimantPhoneNumberSchema.safeParse('(555) 123-4567');
      expect(result.success).to.be.true;
    });

    it('should validate phone number with spaces', () => {
      const result = claimantPhoneNumberSchema.safeParse('555 123 4567');
      expect(result.success).to.be.true;
    });

    it('should validate phone number with mixed formatting', () => {
      const result = claimantPhoneNumberSchema.safeParse('(555)-123 4567');
      expect(result.success).to.be.true;
    });

    it('should reject empty phone number', () => {
      const result = claimantPhoneNumberSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Phone number is required',
        );
      }
    });

    it('should reject phone number with too few digits', () => {
      const result = claimantPhoneNumberSchema.safeParse('555123456');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('valid 10-digit');
      }
    });

    it('should reject phone number with too many digits', () => {
      const result = claimantPhoneNumberSchema.safeParse('55512345678');
      expect(result.success).to.be.false;
    });

    it('should reject phone number with letters', () => {
      const result = claimantPhoneNumberSchema.safeParse('555-123-ABCD');
      expect(result.success).to.be.false;
    });

    it('should reject null phone number', () => {
      const result = claimantPhoneNumberSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined phone number', () => {
      const result = claimantPhoneNumberSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should reject numeric phone number', () => {
      const result = claimantPhoneNumberSchema.safeParse(5551234567);
      expect(result.success).to.be.false;
    });

    it('should strip valid formatting characters from phone number', () => {
      const result = claimantPhoneNumberSchema.safeParse('(555)-123 4567');
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data).to.equal('5551234567');
      }
    });
  });

  describe('claimantMobilePhoneSchema', () => {
    it('should validate 10-digit mobile phone number', () => {
      const result = claimantMobilePhoneSchema.safeParse('5559876543');
      expect(result.success).to.be.true;
    });

    it('should validate mobile phone number with dashes', () => {
      const result = claimantMobilePhoneSchema.safeParse('555-987-6543');
      expect(result.success).to.be.true;
    });

    it('should validate mobile phone number with parentheses', () => {
      const result = claimantMobilePhoneSchema.safeParse('(555) 987-6543');
      expect(result.success).to.be.true;
    });

    it('should validate empty mobile phone number', () => {
      const result = claimantMobilePhoneSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined mobile phone number', () => {
      const result = claimantMobilePhoneSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should reject mobile phone number with too few digits', () => {
      const result = claimantMobilePhoneSchema.safeParse('555987654');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('valid 10-digit');
      }
    });

    it('should reject mobile phone number with too many digits', () => {
      const result = claimantMobilePhoneSchema.safeParse('55598765432');
      expect(result.success).to.be.false;
    });

    it('should reject mobile phone number with letters', () => {
      const result = claimantMobilePhoneSchema.safeParse('555-987-ABCD');
      expect(result.success).to.be.false;
    });

    it('should validate mobile phone number with spaces', () => {
      const result = claimantMobilePhoneSchema.safeParse('555 987 6543');
      expect(result.success).to.be.true;
    });

    it('should strip valid formatting characters from mobile phone number', () => {
      const result = claimantMobilePhoneSchema.safeParse('(555) 987-6543');
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data).to.equal('5559876543');
      }
    });
  });

  describe('claimantEmailSchema', () => {
    it('should validate valid email address', () => {
      const result = claimantEmailSchema.safeParse('john.doe@example.com');
      expect(result.success).to.be.true;
    });

    it('should validate email with subdomain', () => {
      const result = claimantEmailSchema.safeParse('jane@mail.example.com');
      expect(result.success).to.be.true;
    });

    it('should validate email with numbers', () => {
      const result = claimantEmailSchema.safeParse('user123@example.com');
      expect(result.success).to.be.true;
    });

    it('should validate email with hyphens', () => {
      const result = claimantEmailSchema.safeParse('john-doe@my-company.com');
      expect(result.success).to.be.true;
    });

    it('should validate email with plus sign', () => {
      const result = claimantEmailSchema.safeParse('john+tag@example.com');
      expect(result.success).to.be.true;
    });

    it('should validate email with underscores', () => {
      const result = claimantEmailSchema.safeParse('john_doe@example.com');
      expect(result.success).to.be.true;
    });

    it('should reject empty email', () => {
      const result = claimantEmailSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Email address is required',
        );
      }
    });

    it('should reject email without @', () => {
      const result = claimantEmailSchema.safeParse('johnexample.com');
      expect(result.success).to.be.false;
    });

    it('should reject email without domain', () => {
      const result = claimantEmailSchema.safeParse('john@');
      expect(result.success).to.be.false;
    });

    it('should reject email without username', () => {
      const result = claimantEmailSchema.safeParse('@example.com');
      expect(result.success).to.be.false;
    });

    it('should reject email with spaces', () => {
      const result = claimantEmailSchema.safeParse('john doe@example.com');
      expect(result.success).to.be.false;
    });

    it('should reject email with multiple @ symbols', () => {
      const result = claimantEmailSchema.safeParse('john@@example.com');
      expect(result.success).to.be.false;
    });

    it('should reject null email', () => {
      const result = claimantEmailSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined email', () => {
      const result = claimantEmailSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should reject email without TLD', () => {
      const result = claimantEmailSchema.safeParse('john@example');
      expect(result.success).to.be.false;
    });

    it('should validate email with multiple subdomains', () => {
      const result = claimantEmailSchema.safeParse(
        'user@mail.corporate.example.com',
      );
      expect(result.success).to.be.true;
    });
  });

  describe('claimantContactPageSchema', () => {
    it('should validate complete page data', () => {
      const validData = {
        claimantPhoneNumber: '555-123-4567',
        claimantMobilePhone: '555-987-6543',
        claimantEmail: 'john.doe@example.com',
      };
      const result = claimantContactPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate page data without mobile phone', () => {
      const validData = {
        claimantPhoneNumber: '555-123-4567',
        claimantMobilePhone: '',
        claimantEmail: 'john.doe@example.com',
      };
      const result = claimantContactPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate page data with phone number only', () => {
      const validData = {
        claimantPhoneNumber: '5551234567',
        claimantEmail: 'john.doe@example.com',
      };
      const result = claimantContactPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing claimantPhoneNumber', () => {
      const invalidData = {
        claimantMobilePhone: '555-987-6543',
        claimantEmail: 'john.doe@example.com',
      };
      const result = claimantContactPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty claimantPhoneNumber', () => {
      const invalidData = {
        claimantPhoneNumber: '',
        claimantMobilePhone: '555-987-6543',
        claimantEmail: 'john.doe@example.com',
      };
      const result = claimantContactPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing claimantEmail', () => {
      const invalidData = {
        claimantPhoneNumber: '555-123-4567',
        claimantMobilePhone: '555-987-6543',
      };
      const result = claimantContactPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty claimantEmail', () => {
      const invalidData = {
        claimantPhoneNumber: '555-123-4567',
        claimantMobilePhone: '555-987-6543',
        claimantEmail: '',
      };
      const result = claimantContactPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid phone number format', () => {
      const invalidData = {
        claimantPhoneNumber: '123',
        claimantMobilePhone: '555-987-6543',
        claimantEmail: 'john.doe@example.com',
      };
      const result = claimantContactPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid mobile phone format', () => {
      const invalidData = {
        claimantPhoneNumber: '555-123-4567',
        claimantMobilePhone: '123',
        claimantEmail: 'john.doe@example.com',
      };
      const result = claimantContactPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        claimantPhoneNumber: '555-123-4567',
        claimantMobilePhone: '555-987-6543',
        claimantEmail: 'invalid-email',
      };
      const result = claimantContactPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should validate all valid formats with optional mobile empty', () => {
      const validData = {
        claimantPhoneNumber: '(555) 123-4567',
        claimantMobilePhone: '',
        claimantEmail: 'test@example.com',
      };
      const result = claimantContactPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject empty object', () => {
      const invalidData = {};
      const result = claimantContactPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should validate with all fields in various valid formats', () => {
      const validData = {
        claimantPhoneNumber: '(555) 123-4567',
        claimantMobilePhone: '555.987.6543',
        claimantEmail: 'john.doe+tag@mail.example.com',
      };
      const result = claimantContactPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });
  });
});
