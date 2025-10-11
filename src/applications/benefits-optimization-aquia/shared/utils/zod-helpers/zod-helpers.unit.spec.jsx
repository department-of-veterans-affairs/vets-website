import { expect } from 'chai';
import { z } from 'zod';

import {
  createPageValidator,
  createValidationErrorHandler,
  flattenZodError,
} from './zod-helpers';

describe('Zod Helpers - Form validation utilities', () => {
  describe('flattenZodError', () => {
    it('converts Zod errors to flat object', () => {
      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        age: z.number().min(18, 'Must be at least 18'),
      });

      const result = schema.safeParse({ name: '', age: 16 });
      expect(result.success).to.be.false;

      const errors = flattenZodError(result.error);
      expect(errors).to.have.property('name', 'Name is required');
      expect(errors).to.have.property('age', 'Must be at least 18');
    });

    it('handles root level errors', () => {
      const schema = z
        .object({
          name: z.string(),
        })
        .refine(data => data.name !== 'forbidden', {
          message: 'This name is not allowed',
        });

      const result = schema.safeParse({ name: 'forbidden' });
      expect(result.success).to.be.false;

      const errors = flattenZodError(result.error);
      expect(errors).to.have.property('_root', 'This name is not allowed');
    });

    it('flattens nested field errors', () => {
      const schema = z.object({
        address: z.object({
          street: z.string().min(1, 'Street is required'),
          city: z.string().min(1, 'City is required'),
        }),
      });

      const result = schema.safeParse({
        address: { street: '', city: '' },
      });
      expect(result.success).to.be.false;

      const errors = flattenZodError(result.error);
      expect(errors).to.have.property('address');
      expect(errors.address).to.have.property('street', 'Street is required');
      expect(errors.address).to.have.property('city', 'City is required');
    });

    it('indexes array field errors', () => {
      const schema = z.object({
        items: z.array(z.string().min(1, 'Item cannot be empty')),
      });

      const result = schema.safeParse({
        items: ['valid', ''],
      });
      expect(result.success).to.be.false;

      const errors = flattenZodError(result.error);
      expect(errors).to.have.property('items');
      expect(errors.items).to.have.property('1', 'Item cannot be empty');
    });

    it('uses first error per field', () => {
      const schema = z.object({
        email: z.string().email('Invalid email'),
        username: z
          .string()
          .min(3, 'Too short')
          .max(10, 'Too long'),
      });

      const result = schema.safeParse({
        email: 'invalid',
        username: 'ab',
      });
      expect(result.success).to.be.false;

      const errors = flattenZodError(result.error);

      expect(errors).to.have.property('email', 'Invalid email');
      expect(errors).to.have.property('username', 'Too short');
    });

    it('returns empty for no issues', () => {
      const emptyError = { issues: [] };
      const errors = flattenZodError(emptyError);
      expect(errors).to.deep.equal({});
    });

    it('preserves first error per path', () => {
      const mockError = {
        issues: [
          { path: ['field1'], message: 'First error' },
          { path: ['field1'], message: 'Second error' },
        ],
      };

      const errors = flattenZodError(mockError);
      expect(errors).to.have.property('field1', 'First error');
    });

    it('flattens deep nesting', () => {
      const schema = z.object({
        level1: z.object({
          level2: z.object({
            level3: z.string().min(1, 'Deep field required'),
          }),
        }),
      });

      const result = schema.safeParse({
        level1: { level2: { level3: '' } },
      });
      expect(result.success).to.be.false;

      const errors = flattenZodError(result.error);
      expect(errors).to.have.property('level1');
      expect(errors.level1).to.have.property('level2');
      expect(errors.level1.level2).to.have.property(
        'level3',
        'Deep field required',
      );
    });
  });

  describe('createValidationErrorHandler', () => {
    it('validates form data with schema', () => {
      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        age: z.number().min(18, 'Must be 18 or older'),
      });

      const handler = createValidationErrorHandler(schema);

      const errors = handler({ name: '', age: 16 });
      expect(errors).to.have.property('name', 'Name is required');
      expect(errors).to.have.property('age', 'Must be 18 or older');
    });

    it('returns empty for valid data', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const handler = createValidationErrorHandler(schema);

      const errors = handler({ name: 'John', age: 25 });
      expect(errors).to.deep.equal({});
    });

    it('extracts namespaced data', () => {
      const schema = z.object({
        firstName: z.string().min(1, 'First name required'),
        lastName: z.string().min(1, 'Last name required'),
      });

      const handler = createValidationErrorHandler(schema, 'personalInfo');

      const data = {
        personalInfo: {
          firstName: '',
          lastName: '',
        },
        otherData: 'ignored',
      };

      const errors = handler(data);
      expect(errors).to.have.property('firstName', 'First name required');
      expect(errors).to.have.property('lastName', 'Last name required');
    });

    it('handles missing namespace', () => {
      const schema = z.object({
        field: z.string(),
      });

      const handler = createValidationErrorHandler(schema, 'missing');

      const errors = handler({ other: 'data' });

      expect(errors).to.be.an('object');
      expect(Object.keys(errors).length).to.be.greaterThan(0);
    });

    it('validates null data', () => {
      const schema = z.object({
        field: z.string(),
      });

      const handler = createValidationErrorHandler(schema);

      const errors = handler(null);
      expect(errors).to.be.an('object');
      expect(Object.keys(errors).length).to.be.greaterThan(0);
    });

    it('validates undefined data', () => {
      const schema = z.object({
        field: z.string(),
      });

      const handler = createValidationErrorHandler(schema);

      const errors = handler(undefined);
      expect(errors).to.be.an('object');
    });

    it('validates root data directly', () => {
      const schema = z.object({
        email: z.string().email('Invalid email'),
      });

      const handler = createValidationErrorHandler(schema);

      const errors = handler({ email: 'not-an-email' });
      expect(errors).to.have.property('email', 'Invalid email');
    });

    it('validates nested structures', () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(1, 'Name required'),
            age: z.number().min(0, 'Age must be positive'),
          }),
        }),
      });

      const handler = createValidationErrorHandler(schema);

      const errors = handler({
        user: {
          profile: {
            name: '',
            age: -5,
          },
        },
      });

      expect(errors).to.have.property('user');
      expect(errors.user).to.have.property('profile');
      expect(errors.user.profile).to.have.property('name', 'Name required');
      expect(errors.user.profile).to.have.property(
        'age',
        'Age must be positive',
      );
    });
  });

  describe('createPageValidator', () => {
    it('returns true for valid data', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const validator = createPageValidator(schema);

      const isValid = validator({ name: 'John', age: 25 });
      expect(isValid).to.be.true;
    });

    it('returns false for invalid data', () => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(18),
      });

      const validator = createPageValidator(schema);

      const isValid = validator({ name: '', age: 16 });
      expect(isValid).to.be.false;
    });

    it('extracts namespaced data', () => {
      const schema = z.object({
        email: z.string().email(),
      });

      const validator = createPageValidator(schema, 'contact');

      const validData = {
        contact: { email: 'test@example.com' },
        other: 'ignored',
      };

      expect(validator(validData)).to.be.true;

      const invalidData = {
        contact: { email: 'not-an-email' },
        other: 'ignored',
      };

      expect(validator(invalidData)).to.be.false;
    });

    it('handles missing namespace', () => {
      const schema = z.object({
        required: z.string().min(1),
      });

      const validator = createPageValidator(schema, 'missing');

      const isValid = validator({ other: 'data' });
      expect(isValid).to.be.false;
    });

    it('validates null data', () => {
      const schema = z.object({
        field: z.string(),
      });

      const validator = createPageValidator(schema);

      const isValid = validator(null);
      expect(isValid).to.be.false;
    });

    it('validates undefined data', () => {
      const schema = z.object({
        field: z.string(),
      });

      const validator = createPageValidator(schema);

      const isValid = validator(undefined);
      expect(isValid).to.be.false;
    });

    it('validates root data directly', () => {
      const schema = z.object({
        active: z.boolean(),
      });

      const validator = createPageValidator(schema);

      expect(validator({ active: true })).to.be.true;
      expect(validator({ active: 'not-boolean' })).to.be.false;
    });

    it('allows optional fields', () => {
      const schema = z.object({
        required: z.string(),
        optional: z.string().optional(),
      });

      const validator = createPageValidator(schema);

      expect(validator({ required: 'value' })).to.be.true;
      expect(validator({ required: 'value', optional: 'extra' })).to.be.true;
      expect(validator({ optional: 'only' })).to.be.false;
    });

    it('applies schema refinements', () => {
      const schema = z
        .object({
          password: z.string(),
          confirmPassword: z.string(),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: 'Passwords must match',
        });

      const validator = createPageValidator(schema);

      expect(
        validator({
          password: 'secret',
          confirmPassword: 'secret',
        }),
      ).to.be.true;

      expect(
        validator({
          password: 'secret',
          confirmPassword: 'different',
        }),
      ).to.be.false;
    });
  });

  describe('integration', () => {
    it('combines validator and error handler', () => {
      const schema = z.object({
        username: z.string().min(3, 'Username too short'),
        email: z.string().email('Invalid email'),
        age: z.number().min(13, 'Must be 13 or older'),
      });

      const errorHandler = createValidationErrorHandler(schema);
      const validator = createPageValidator(schema);

      const invalidData = {
        username: 'ab',
        email: 'not-email',
        age: 10,
      };

      expect(validator(invalidData)).to.be.false;

      const errors = errorHandler(invalidData);
      expect(errors).to.have.property('username', 'Username too short');
      expect(errors).to.have.property('email', 'Invalid email');
      expect(errors).to.have.property('age', 'Must be 13 or older');

      const validData = {
        username: 'johndoe',
        email: 'john@example.com',
        age: 25,
      };

      expect(validator(validData)).to.be.true;

      const noErrors = errorHandler(validData);
      expect(noErrors).to.deep.equal({});
    });

    it('validates multi-section forms', () => {
      const personalSchema = z.object({
        firstName: z.string().min(1, 'First name required'),
        lastName: z.string().min(1, 'Last name required'),
      });

      const contactSchema = z.object({
        email: z.string().email('Invalid email'),
        phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
      });

      const personalValidator = createPageValidator(personalSchema, 'personal');
      const personalErrorHandler = createValidationErrorHandler(
        personalSchema,
        'personal',
      );

      const contactValidator = createPageValidator(contactSchema, 'contact');
      const contactErrorHandler = createValidationErrorHandler(
        contactSchema,
        'contact',
      );

      const formData = {
        personal: {
          firstName: '',
          lastName: 'Doe',
        },
        contact: {
          email: 'john@example.com',
          phone: '123',
        },
      };

      expect(personalValidator(formData)).to.be.false;
      const personalErrors = personalErrorHandler(formData);
      expect(personalErrors).to.have.property(
        'firstName',
        'First name required',
      );
      expect(personalErrors).to.not.have.property('lastName');

      expect(contactValidator(formData)).to.be.false;
      const contactErrors = contactErrorHandler(formData);
      expect(contactErrors).to.have.property(
        'phone',
        'Phone must be 10 digits',
      );
      expect(contactErrors).to.not.have.property('email');
    });

    it('validates complex forms', () => {
      const schema = z.object({
        applicant: z.object({
          name: z.string().min(1, 'Name required'),
          address: z.object({
            street: z.string().min(1, 'Street required'),
            city: z.string().min(1, 'City required'),
            zip: z.string().regex(/^\d{5}$/, 'Invalid ZIP'),
          }),
        }),
        references: z
          .array(
            z.object({
              name: z.string().min(1, 'Reference name required'),
              phone: z.string().min(10, 'Phone too short'),
            }),
          )
          .min(1, 'At least one reference required'),
      });

      const validator = createPageValidator(schema);
      const errorHandler = createValidationErrorHandler(schema);

      const invalidData = {
        applicant: {
          name: '',
          address: {
            street: '123 Main',
            city: '',
            zip: 'abc',
          },
        },
        references: [],
      };

      expect(validator(invalidData)).to.be.false;

      const errors = errorHandler(invalidData);
      expect(errors).to.have.property('applicant');
      expect(errors.applicant).to.have.property('name', 'Name required');
      expect(errors.applicant).to.have.property('address');
      expect(errors.applicant.address).to.have.property(
        'city',
        'City required',
      );
      expect(errors.applicant.address).to.have.property('zip', 'Invalid ZIP');
      expect(errors).to.have.property(
        'references',
        'At least one reference required',
      );
    });
  });
});
