import { expect } from 'chai';
import {
  nursingHomeAddressSchema,
  nursingHomeDetailsSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/nursing-home/nursing-home';

describe('Nursing Home Information Schemas', () => {
  describe('nursingHomeAddressSchema', () => {
    it('should validate complete address', () => {
      const validData = {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };
      const result = nursingHomeAddressSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate address with apartment number', () => {
      const validData = {
        street: '456 Oak Ave Apt 2B',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
      };
      const result = nursingHomeAddressSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate address with ZIP+4', () => {
      const validData = {
        street: '789 Elm Street',
        city: 'Boston',
        state: 'MA',
        postalCode: '02101-1234',
      };
      const result = nursingHomeAddressSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate address with full state name', () => {
      const validData = {
        street: '321 Pine Road',
        city: 'Austin',
        state: 'Texas',
        postalCode: '73301',
      };
      const result = nursingHomeAddressSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing street', () => {
      const invalidData = {
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty street', () => {
      const invalidData = {
        street: '',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Street address is required',
        );
      }
    });

    it('should reject missing city', () => {
      const invalidData = {
        street: '123 Main Street',
        state: 'IL',
        postalCode: '62701',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty city', () => {
      const invalidData = {
        street: '123 Main Street',
        city: '',
        state: 'IL',
        postalCode: '62701',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal('City is required');
      }
    });

    it('should reject missing state', () => {
      const invalidData = {
        street: '123 Main Street',
        city: 'Springfield',
        postalCode: '62701',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject state with less than 2 characters', () => {
      const invalidData = {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'I',
        postalCode: '62701',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal('State is required');
      }
    });

    it('should reject empty state', () => {
      const invalidData = {
        street: '123 Main Street',
        city: 'Springfield',
        state: '',
        postalCode: '62701',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing postalCode', () => {
      const invalidData = {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid postalCode format', () => {
      const invalidData = {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        postalCode: '123',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject postalCode with letters', () => {
      const invalidData = {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        postalCode: 'ABCDE',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty postalCode', () => {
      const invalidData = {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        postalCode: '',
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty object', () => {
      const invalidData = {};
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null values', () => {
      const invalidData = {
        street: null,
        city: null,
        state: null,
        postalCode: null,
      };
      const result = nursingHomeAddressSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });

  describe('nursingHomeDetailsSchema', () => {
    it('should validate complete nursing home details', () => {
      const validData = {
        nursingHomeName: 'Sunshine Senior Care',
        nursingHomeAddress: {
          street: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with complex facility name', () => {
      const validData = {
        nursingHomeName: "St. Mary's Extended Care & Rehabilitation Center",
        nursingHomeAddress: {
          street: '456 Oak Avenue Suite 100',
          city: 'Boston',
          state: 'MA',
          postalCode: '02101-1234',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with long facility name', () => {
      const validData = {
        nursingHomeName:
          'Veterans Memorial Advanced Care and Long-Term Rehabilitation Facility',
        nursingHomeAddress: {
          street: '789 Elm Street',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing nursingHomeName', () => {
      const invalidData = {
        nursingHomeAddress: {
          street: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty nursingHomeName', () => {
      const invalidData = {
        nursingHomeName: '',
        nursingHomeAddress: {
          street: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Nursing home name is required',
        );
      }
    });

    it('should reject missing nursingHomeAddress', () => {
      const invalidData = {
        nursingHomeName: 'Sunshine Senior Care',
      };
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject incomplete nursingHomeAddress', () => {
      const invalidData = {
        nursingHomeName: 'Sunshine Senior Care',
        nursingHomeAddress: {
          street: '123 Main Street',
          city: 'Springfield',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty street in address', () => {
      const invalidData = {
        nursingHomeName: 'Sunshine Senior Care',
        nursingHomeAddress: {
          street: '',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid postalCode in address', () => {
      const invalidData = {
        nursingHomeName: 'Sunshine Senior Care',
        nursingHomeAddress: {
          street: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          postalCode: '123',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty object', () => {
      const invalidData = {};
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject with multiple invalid fields and provide all errors', () => {
      const invalidData = {
        nursingHomeName: '',
        nursingHomeAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '123',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues.length).to.be.greaterThan(1);
      }
    });

    it('should reject null nursingHomeName', () => {
      const invalidData = {
        nursingHomeName: null,
        nursingHomeAddress: {
          street: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null nursingHomeAddress', () => {
      const invalidData = {
        nursingHomeName: 'Sunshine Senior Care',
        nursingHomeAddress: null,
      };
      const result = nursingHomeDetailsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
