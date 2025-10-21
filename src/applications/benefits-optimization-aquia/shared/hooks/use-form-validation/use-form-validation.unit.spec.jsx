import { act, renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import { z } from 'zod';

import { useFormValidation } from './use-form-validation';

describe('useFormValidation - Real-time validation hook', () => {
  const testSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be at least 18'),
  });

  describe('initialization', () => {
    it('starts with empty errors', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      expect(result.current.errors).to.deep.equal({});
      expect(result.current.isValid).to.be.false;
    });
  });

  describe('form validation', () => {
    it('validates complete form data', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      };

      let isValid;
      act(() => {
        isValid = result.current.validate(validData);
      });

      expect(isValid).to.be.true;
      expect(result.current.errors).to.deep.equal({});
      expect(result.current.isValid).to.be.true;
    });

    it('returns false for invalid data', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      const invalidData = {
        name: '',
        email: 'not-an-email',
        age: 16,
      };

      let isValid;
      act(() => {
        isValid = result.current.validate(invalidData);
      });

      expect(isValid).to.be.false;
      expect(result.current.errors).to.have.property(
        'name',
        'Name is required',
      );
      expect(result.current.errors).to.have.property('email', 'Invalid email');
      expect(result.current.errors).to.have.property(
        'age',
        'Must be at least 18',
      );
      expect(result.current.isValid).to.be.false;
    });

    it('clear previous errors on successful validation', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      act(() => {
        result.current.validate({ name: '', email: 'bad', age: 10 });
      });

      expect(result.current.errors).to.not.be.empty;

      const validData = {
        name: 'John',
        email: 'john@example.com',
        age: 20,
      };

      act(() => {
        result.current.validate(validData);
      });

      expect(result.current.errors).to.deep.equal({});
      expect(result.current.isValid).to.be.true;
    });

    it('handle nested object validation', () => {
      const nestedSchema = z.object({
        user: z.object({
          name: z.string().min(1, 'Name required'),
          profile: z.object({
            bio: z.string().min(10, 'Bio too short'),
          }),
        }),
      });

      const { result } = renderHook(() => useFormValidation(nestedSchema));

      const invalidData = {
        user: {
          name: '',
          profile: {
            bio: 'short',
          },
        },
      };

      act(() => {
        result.current.validate(invalidData);
      });

      expect(result.current.errors).to.have.property('user');
      expect(result.current.errors.user).to.have.property(
        'name',
        'Name required',
      );
      expect(result.current.errors.user).to.have.property('profile');
      expect(result.current.errors.user.profile).to.have.property(
        'bio',
        'Bio too short',
      );
    });

    it('handle array validation', () => {
      const arraySchema = z.object({
        items: z
          .array(z.string().min(1, 'Item cannot be empty'))
          .min(1, 'At least one item required'),
      });

      const { result } = renderHook(() => useFormValidation(arraySchema));

      act(() => {
        result.current.validate({ items: [] });
      });

      expect(result.current.errors).to.have.property(
        'items',
        'At least one item required',
      );

      act(() => {
        result.current.validate({ items: ['valid', ''] });
      });

      expect(result.current.errors).to.have.nested.property(
        'items.1',
        'Item cannot be empty',
      );
    });

    it('throw non-Zod errors', () => {
      const customSchema = {
        parse: () => {
          throw new Error('Custom error');
        },
      };

      const { result } = renderHook(() => useFormValidation(customSchema));

      expect(() => {
        act(() => {
          result.current.validate({});
        });
      }).to.throw('Custom error');
    });
  });

  describe('validateField', () => {
    it('validate a single valid field', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      let isValid;
      act(() => {
        isValid = result.current.validateField('name', 'John');
      });

      expect(isValid).to.be.true;
      expect(result.current.errors).to.not.have.property('name');
    });

    it('validate a single invalid field', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      let isValid;
      act(() => {
        isValid = result.current.validateField('name', '');
      });

      expect(isValid).to.be.false;
      expect(result.current.errors).to.have.property(
        'name',
        'Name is required',
      );
    });

    it('clear field error when it becomes valid', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      act(() => {
        result.current.validateField('email', 'invalid');
      });

      expect(result.current.errors).to.have.property('email');

      act(() => {
        result.current.validateField('email', 'valid@example.com');
      });

      expect(result.current.errors).to.not.have.property('email');
    });

    it('preserve other field errors', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      act(() => {
        result.current.validateField('name', '');
        result.current.validateField('email', 'invalid');
      });

      expect(result.current.errors).to.have.property('name');
      expect(result.current.errors).to.have.property('email');

      act(() => {
        result.current.validateField('name', 'John');
      });

      expect(result.current.errors).to.not.have.property('name');
      expect(result.current.errors).to.have.property('email');
    });

    it('handle field that does not exist in schema', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      let isValid;
      act(() => {
        isValid = result.current.validateField('nonExistentField', 'value');
      });

      expect(isValid).to.be.true;
      expect(result.current.errors).to.not.have.property('nonExistentField');
    });

    it('handle complex field types', () => {
      const complexSchema = z.object({
        tags: z.array(z.string()),
        metadata: z.object({
          key: z.string(),
        }),
      });

      const { result } = renderHook(() => useFormValidation(complexSchema));

      act(() => {
        result.current.validateField('tags', ['tag1', 'tag2']);
      });

      expect(result.current.errors).to.not.have.property('tags');

      act(() => {
        result.current.validateField('metadata', { key: 'value' });
      });

      expect(result.current.errors).to.not.have.property('metadata');
    });

    it('handle Zod error with multiple issues', () => {
      const customSchema = z.object({
        password: z
          .string()
          .min(8, 'Too short')
          .regex(/[A-Z]/, 'Must contain uppercase')
          .regex(/[0-9]/, 'Must contain number'),
      });

      const { result } = renderHook(() => useFormValidation(customSchema));

      act(() => {
        result.current.validateField('password', 'abc');
      });

      expect(result.current.errors).to.have.property('password', 'Too short');
    });

    it('use fallback message when no error message provided', () => {
      const mockSchema = {
        shape: {
          field: {
            parse: () => {
              throw new z.ZodError([]);
            },
          },
        },
      };

      const { result } = renderHook(() => useFormValidation(mockSchema));

      act(() => {
        result.current.validateField('field', 'value');
      });

      expect(result.current.errors).to.have.property(
        'field',
        'Validation failed',
      );
    });
  });

  describe('clearErrors', () => {
    it('clear all errors', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      act(() => {
        result.current.validate({ name: '', email: 'bad', age: 10 });
      });

      expect(result.current.errors).to.not.be.empty;
      expect(result.current.isValid).to.be.false;

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.errors).to.deep.equal({});
      expect(result.current.isValid).to.be.false;
    });

    it('reset isValid to false', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      act(() => {
        result.current.validate({
          name: 'John',
          email: 'john@example.com',
          age: 25,
        });
      });

      expect(result.current.isValid).to.be.true;

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.isValid).to.be.false;
    });
  });

  describe('stability and performance', () => {
    it('maintain referential stability of functions', () => {
      const { result, rerender } = renderHook(() =>
        useFormValidation(testSchema),
      );

      const firstValidate = result.current.validate;
      const firstValidateField = result.current.validateField;
      const firstClearErrors = result.current.clearErrors;

      rerender();

      expect(result.current.validate).to.equal(firstValidate);
      expect(result.current.validateField).to.equal(firstValidateField);
      expect(result.current.clearErrors).to.equal(firstClearErrors);
    });

    it('update functions when schema changes', () => {
      const { result, rerender } = renderHook(
        schema => useFormValidation(schema),
        {
          initialProps: testSchema,
        },
      );

      const firstValidate = result.current.validate;

      const newSchema = z.object({ field: z.string() });
      rerender(newSchema);

      expect(result.current.validate).to.not.equal(firstValidate);
    });

    it('handle rapid successive validations', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      act(() => {
        result.current.validate({ name: '', email: '', age: 0 });
        result.current.validate({ name: 'J', email: 'j', age: 5 });
        result.current.validate({ name: 'John', email: 'john@', age: 15 });
        result.current.validate({
          name: 'John',
          email: 'john@example.com',
          age: 25,
        });
      });

      expect(result.current.errors).to.deep.equal({});
      expect(result.current.isValid).to.be.true;
    });
  });

  describe('edge cases', () => {
    it('handle undefined schema shape', () => {
      const simpleSchema = {
        parse: data => data,
      };

      const { result } = renderHook(() => useFormValidation(simpleSchema));

      let isValid;
      act(() => {
        isValid = result.current.validateField('anyField', 'value');
      });

      expect(isValid).to.be.true;
    });

    it('handle null and undefined values', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      act(() => {
        result.current.validate(null);
      });

      expect(result.current.errors).to.not.be.empty;

      act(() => {
        result.current.validate(undefined);
      });

      expect(result.current.errors).to.not.be.empty;

      act(() => {
        result.current.validateField('name', null);
      });

      expect(result.current.errors).to.have.property('name');

      act(() => {
        result.current.validateField('name', undefined);
      });

      expect(result.current.errors).to.have.property('name');
    });

    it('handle circular references in data', () => {
      const { result } = renderHook(() => useFormValidation(testSchema));

      const circularData = { name: 'John', email: 'john@example.com', age: 25 };
      circularData.self = circularData;

      let isValid;
      act(() => {
        isValid = result.current.validate(circularData);
      });

      expect(isValid).to.be.true;
    });
  });
});
