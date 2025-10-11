import { expect } from 'chai';
import { z } from 'zod';
import {
  createFieldValidator,
  getZodErrorMessage,
  transformZodErrors,
  validateWithZod,
} from './zod-integration';

describe('Zod Integration', () => {
  describe('getZodErrorMessage', () => {
    it('formats required field errors', () => {
      const message = getZodErrorMessage('required', 'firstName');
      expect(message).to.equal('This field is required');
    });

    it('formats type errors', () => {
      const message = getZodErrorMessage('invalid_type', 'age');
      expect(message).to.equal('Please enter a valid value');
    });

    it('formats minimum length errors', () => {
      const message = getZodErrorMessage('too_small', 'password');
      expect(message).to.equal('Value is too short');
    });

    it('formats maximum length errors', () => {
      const message = getZodErrorMessage('too_big', 'description');
      expect(message).to.equal('Value is too long');
    });

    it('returns friendly string format errors', () => {
      const message = getZodErrorMessage('invalid_string', 'email');
      expect(message).to.equal('Invalid format');
    });

    it('returns friendly date errors', () => {
      const message = getZodErrorMessage('invalid_date', 'birthDate');
      expect(message).to.equal('Please enter a valid date');
    });

    it('returns friendly enum errors', () => {
      const message = getZodErrorMessage('invalid_enum_value', 'status');
      expect(message).to.equal('Please select a valid option');
    });

    it('returns friendly union errors', () => {
      const message = getZodErrorMessage('invalid_union', 'field');
      expect(message).to.equal('Invalid value');
    });

    it('returns friendly custom errors', () => {
      const message = getZodErrorMessage('custom', 'field');
      expect(message).to.equal('Invalid value');
    });

    it('returns undefined for unknown codes', () => {
      const message = getZodErrorMessage('unknown_code', 'field');
      expect(message).to.be.undefined;
    });

    it('handles null codes', () => {
      const message = getZodErrorMessage(null, 'field');
      expect(message).to.be.null;
    });

    it('handles undefined codes', () => {
      const message = getZodErrorMessage(undefined, 'field');
      expect(message).to.be.null;
    });
  });

  describe('validateWithZod', () => {
    const testSchema = z.object({
      name: z.string().min(2),
      age: z
        .number()
        .min(0)
        .max(120),
      email: z.string().email(),
    });

    it('returns null when data is valid', () => {
      const data = {
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
      };

      const errors = validateWithZod(testSchema, data);
      expect(errors).to.be.null;
    });

    it('returns error object for invalid data', () => {
      const data = {
        name: 'J',
        age: 150,
        email: 'invalid-email',
      };

      const errors = validateWithZod(testSchema, data);
      expect(errors).to.be.an('object');
      expect(errors).to.have.property('name');
      expect(errors).to.have.property('age');
      expect(errors).to.have.property('email');
    });

    it('includes specific validation messages', () => {
      const data = {
        name: '',
        age: -5,
        email: 'not-an-email',
      };

      const errors = validateWithZod(testSchema, data);
      expect(errors.name).to.include('at least');
      expect(errors.age).to.include('greater');
      expect(errors.email).to.include('email');
    });

    it('handle nested objects', () => {
      const nestedSchema = z.object({
        user: z.object({
          name: z.string().min(2),
          email: z.string().email(),
        }),
      });

      const data = {
        user: {
          name: 'J',
          email: 'invalid',
        },
      };

      const errors = validateWithZod(nestedSchema, data);
      expect(errors).to.have.property('user.name');
      expect(errors).to.have.property('user.email');
    });

    it('handle arrays', () => {
      const arraySchema = z.object({
        items: z.array(z.string().min(2)),
      });

      const data = {
        items: ['ok', 'a', 'good'],
      };

      const errors = validateWithZod(arraySchema, data);
      expect(errors).to.have.property('items[1]');
      expect(errors['items[1]']).to.include('at least');
    });
  });

  describe('transformZodErrors', () => {
    it('transforms flat errors to object', () => {
      const zodErrors = [
        { path: ['name'], message: 'Required' },
        { path: ['email'], message: 'Invalid email' },
      ];

      const result = transformZodErrors(zodErrors);
      expect(result).to.deep.equal({
        name: 'Required',
        email: 'Invalid email',
      });
    });

    it('transforms nested errors with dot notation', () => {
      const zodErrors = [
        { path: ['user', 'name'], message: 'Required' },
        { path: ['user', 'email'], message: 'Invalid' },
      ];

      const result = transformZodErrors(zodErrors);
      expect(result).to.deep.equal({
        'user.name': 'Required',
        'user.email': 'Invalid',
      });
    });

    it('transforms array errors with brackets', () => {
      const zodErrors = [
        { path: ['items', 0], message: 'Invalid item' },
        { path: ['items', 2], message: 'Too short' },
      ];

      const result = transformZodErrors(zodErrors);
      expect(result).to.deep.equal({
        'items[0]': 'Invalid item',
        'items[2]': 'Too short',
      });
    });

    it('handles empty error arrays', () => {
      const result = transformZodErrors([]);
      expect(result).to.deep.equal({});
    });

    it('handles root-level errors', () => {
      const zodErrors = [{ path: [], message: 'General error' }];

      const result = transformZodErrors(zodErrors);
      expect(result).to.have.property('_root');
      expect(result._root).to.equal('General error');
    });

    it('keeps first error for duplicate paths', () => {
      const zodErrors = [
        { path: ['email'], message: 'First error' },
        { path: ['email'], message: 'Second error' },
      ];

      const result = transformZodErrors(zodErrors);
      expect(result.email).to.equal('First error');
    });
  });

  describe('createFieldValidator', () => {
    const nameSchema = z
      .string()
      .min(2)
      .max(50);

    it('creates field validator function', () => {
      const validator = createFieldValidator(nameSchema);
      expect(validator).to.be.a('function');
    });

    it('returns null for valid input', () => {
      const validator = createFieldValidator(nameSchema);
      const error = validator('John Doe');
      expect(error).to.be.null;
    });

    it('returns error for invalid input', () => {
      const validator = createFieldValidator(nameSchema);
      const error = validator('J');
      expect(error).to.be.a('string');
      expect(error).to.include('at least');
    });

    it('handle optional values', () => {
      const optionalSchema = z
        .string()
        .min(2)
        .optional();
      const validator = createFieldValidator(optionalSchema);

      expect(validator(undefined)).to.be.null;
      expect(validator('')).to.be.null;
      expect(validator('John')).to.be.null;
      expect(validator('J')).to.include('at least');
    });

    it('handle transformations', () => {
      const transformSchema = z
        .string()
        .transform(val => val.toUpperCase())
        .pipe(z.string().min(2));

      const validator = createFieldValidator(transformSchema);
      expect(validator('jo')).to.be.null; // 'jo' becomes 'JO' which is valid
      expect(validator('j')).to.include('at least');
    });

    it('validates email format', () => {
      const emailSchema = z.string().email();
      const validator = createFieldValidator(emailSchema);

      expect(validator('test@example.com')).to.be.null;
      expect(validator('invalid-email')).to.include('email');
    });

    it('preserves custom error messages', () => {
      const customSchema = z
        .string()
        .min(2, 'Name must be at least 2 characters');

      const validator = createFieldValidator(customSchema);
      const error = validator('J');
      expect(error).to.equal('Name must be at least 2 characters');
    });

    it('handle refinements', () => {
      const refinedSchema = z
        .string()
        .refine(val => val !== 'forbidden', 'This value is not allowed');

      const validator = createFieldValidator(refinedSchema);
      expect(validator('allowed')).to.be.null;
      expect(validator('forbidden')).to.equal('This value is not allowed');
    });
  });
});
