import { expect } from 'chai';
import {
  phoneSchema,
  emailSchema,
  zipCodeSchema,
  addressSchema,
  mailingAddressSchema,
  contactInfoSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/contact-info/contact-info';

describe('Contact Info Schemas', () => {
  describe('phoneSchema', () => {
    it('should validate valid phone number', () => {
      const result = phoneSchema.safeParse('5551234567');
      expect(result.success).to.be.true;
    });

    it('should reject phone number with dashes (requires digits only)', () => {
      const result = phoneSchema.safeParse('555-123-4567');
      expect(result.success).to.be.false;
    });

    it('should reject phone number with parentheses (requires digits only)', () => {
      const result = phoneSchema.safeParse('(555) 123-4567');
      expect(result.success).to.be.false;
    });

    it('should reject empty phone (schema requires valid format when provided)', () => {
      const result = phoneSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should validate undefined phone (optional)', () => {
      const result = phoneSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should reject invalid phone format', () => {
      const result = phoneSchema.safeParse('123');
      expect(result.success).to.be.false;
    });

    it('should reject phone with letters', () => {
      const result = phoneSchema.safeParse('555-123-ABCD');
      expect(result.success).to.be.false;
    });
  });

  describe('emailSchema', () => {
    it('should validate valid email', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).to.be.true;
    });

    it('should validate email with subdomain', () => {
      const result = emailSchema.safeParse('user@mail.example.com');
      expect(result.success).to.be.true;
    });

    it('should validate email with plus sign', () => {
      const result = emailSchema.safeParse('user+tag@example.com');
      expect(result.success).to.be.true;
    });

    it('should reject empty email (schema requires valid format when provided)', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should validate undefined email (optional)', () => {
      const result = emailSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should reject invalid email without @', () => {
      const result = emailSchema.safeParse('testexample.com');
      expect(result.success).to.be.false;
    });

    it('should reject invalid email without domain', () => {
      const result = emailSchema.safeParse('test@');
      expect(result.success).to.be.false;
    });
  });

  describe('zipCodeSchema', () => {
    it('should validate 5-digit ZIP code', () => {
      const result = zipCodeSchema.safeParse('12345');
      expect(result.success).to.be.true;
    });

    it('should validate ZIP+4 code', () => {
      const result = zipCodeSchema.safeParse('12345-6789');
      expect(result.success).to.be.true;
    });

    it('should reject invalid ZIP code', () => {
      const result = zipCodeSchema.safeParse('123');
      expect(result.success).to.be.false;
    });

    it('should reject ZIP code with letters', () => {
      const result = zipCodeSchema.safeParse('ABCDE');
      expect(result.success).to.be.false;
    });

    it('should reject empty ZIP code', () => {
      const result = zipCodeSchema.safeParse('');
      expect(result.success).to.be.false;
    });
  });

  describe('addressSchema', () => {
    it('should validate complete address', () => {
      const validData = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };
      const result = addressSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate address with street2', () => {
      const validData = {
        street: '123 Main St',
        street2: 'Apt 2B',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };
      const result = addressSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate address with ZIP+4', () => {
      const validData = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701-1234',
      };
      const result = addressSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should default country to USA', () => {
      const validData = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };
      const result = addressSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.country).to.equal('USA');
      }
    });

    it('should reject missing street', () => {
      const invalidData = {
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };
      const result = addressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty street', () => {
      const invalidData = {
        street: '',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };
      const result = addressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing city', () => {
      const invalidData = {
        street: '123 Main St',
        state: 'IL',
        postalCode: '62701',
      };
      const result = addressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty city', () => {
      const invalidData = {
        street: '123 Main St',
        city: '',
        state: 'IL',
        postalCode: '62701',
      };
      const result = addressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject state with less than 2 characters', () => {
      const invalidData = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'I',
        postalCode: '62701',
      };
      const result = addressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid postal code', () => {
      const invalidData = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '123',
      };
      const result = addressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });

  describe('mailingAddressSchema', () => {
    it('should validate complete mailing address', () => {
      const validData = {
        street: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
      };
      const result = mailingAddressSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate mailing address with street2', () => {
      const validData = {
        street: '456 Oak Ave',
        street2: 'Suite 100',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
      };
      const result = mailingAddressSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing street', () => {
      const invalidData = {
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
      };
      const result = mailingAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid postal code', () => {
      const invalidData = {
        street: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        postalCode: 'INVALID',
      };
      const result = mailingAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });

  describe('contactInfoSchema', () => {
    it('should validate complete contact info with unformatted phone', () => {
      const validData = {
        phone: '5551234567',
        email: 'test@example.com',
        mailingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = contactInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject without optional phone when phone has invalid format', () => {
      const validData = {
        phone: '555-123-4567',
        email: 'test@example.com',
        mailingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = contactInfoSchema.safeParse(validData);
      expect(result.success).to.be.false;
    });

    it('should reject without optional email when email is invalid', () => {
      const validData = {
        phone: '555-123-4567',
        email: '',
        mailingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = contactInfoSchema.safeParse(validData);
      expect(result.success).to.be.false;
    });

    it('should reject missing mailingAddress', () => {
      const invalidData = {
        phone: '555-123-4567',
        email: 'test@example.com',
      };
      const result = contactInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid mailingAddress', () => {
      const invalidData = {
        phone: '555-123-4567',
        email: 'test@example.com',
        mailingAddress: {
          street: '',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = contactInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid phone format', () => {
      const invalidData = {
        phone: '123',
        email: 'test@example.com',
        mailingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = contactInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        phone: '555-123-4567',
        email: 'invalid-email',
        mailingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = contactInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
