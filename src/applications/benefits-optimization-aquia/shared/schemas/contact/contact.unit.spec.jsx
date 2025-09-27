import { expect } from 'chai';
import { emailAddressSchema, phoneNumberSchema } from './contact';

describe('Contact Schemas - Contact validation', () => {
  describe('emailAddressSchema', () => {
    it('validates email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'first+last@test.org',
        'john.doe123@subdomain.example.com',
        'test_email@domain-name.com',
      ];

      validEmails.forEach(email => {
        const result = emailAddressSchema.safeParse(email);
        expect(result.success).to.be.true;
      });
    });

    it('reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid.email',
        '@domain.com',
        'user@',
        'user space@domain.com',
        'user@domain',
        'user@.com',
        'user..name@domain.com',
        '',
      ];

      invalidEmails.forEach(email => {
        const result = emailAddressSchema.safeParse(email);
        expect(result.success).to.be.false;
      });
    });

    it('reject emails longer than 100 characters', () => {
      const longEmail = `${'a'.repeat(90)}@example.com`;
      const result = emailAddressSchema.safeParse(longEmail);
      expect(result.success).to.be.false;
    });

    it('provide appropriate error message for invalid format', () => {
      const result = emailAddressSchema.safeParse('invalid-email');
      expect(result.success).to.be.false;
      if (!result.success && result.error && result.error.errors) {
        expect(result.error.errors[0].message).to.include('email');
      }
    });

    it('handle emails with various valid special characters', () => {
      const specialEmails = [
        'user+tag@example.com',
        'user.name@example.com',
        'user_name@example.com',
        'user-name@example.com',
      ];

      specialEmails.forEach(email => {
        const result = emailAddressSchema.safeParse(email);
        expect(result.success).to.be.true;
      });
    });
  });

  describe('phoneNumberSchema', () => {
    it('validate valid US phone numbers', () => {
      const validPhones = [
        '2345678901',
        '555-123-4567',
        '(555) 123-4567',
        '555.123.4567',
        '555 123 4567',
      ];

      validPhones.forEach(phone => {
        const result = phoneNumberSchema.safeParse(phone);
        expect(result.success).to.be.true;
      });
    });

    it('transform formatted numbers to digits only', () => {
      const formattedPhones = [
        { input: '(555) 123-4567', expected: '5551234567' },
        { input: '555-123-4567', expected: '5551234567' },
        { input: '555.123.4567', expected: '5551234567' },
        { input: '555 123 4567', expected: '5551234567' },
      ];

      formattedPhones.forEach(({ input, expected }) => {
        const result = phoneNumberSchema.safeParse(input);
        expect(result.success).to.be.true;
        expect(result.data).to.equal(expected);
      });
    });

    it('reject invalid phone numbers', () => {
      const invalidPhones = [
        '123456789', // too short
        '12345678901', // too long
        'abc1234567', // contains letters
        '123-456-789', // too short when formatted
      ];

      invalidPhones.forEach(phone => {
        const result = phoneNumberSchema.safeParse(phone);
        expect(result.success).to.be.false;
      });
    });

    it('allow empty phone number since it is optional', () => {
      const result = phoneNumberSchema.safeParse('');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('');
    });

    it('handle phone numbers with various formatting', () => {
      const result1 = phoneNumberSchema.safeParse('(555) 123-4567');
      expect(result1.success).to.be.true;
      expect(result1.data).to.equal('5551234567');

      const result2 = phoneNumberSchema.safeParse('555.123.4567');
      expect(result2.success).to.be.true;
      expect(result2.data).to.equal('5551234567');
    });

    it('provide appropriate error message for invalid format', () => {
      const result = phoneNumberSchema.safeParse('123');
      expect(result.success).to.be.false;
      if (!result.success && result.error && result.error.errors) {
        expect(result.error.errors[0].message).to.include('10');
      }
    });

    it('handle edge cases', () => {
      // Phone number with all same digits
      const result1 = phoneNumberSchema.safeParse('1111111111');
      expect(result1.success).to.be.true;

      // Phone number starting with 0
      const result2 = phoneNumberSchema.safeParse('0123456789');
      expect(result2.success).to.be.true;
    });

    it('strip all non-digit characters during transformation', () => {
      const messyInput = '(555) - 123 - 4567 ext';
      const result = phoneNumberSchema.safeParse(messyInput);
      expect(result.success).to.be.true;
      expect(result.data).to.equal('5551234567');
    });
  });
});
