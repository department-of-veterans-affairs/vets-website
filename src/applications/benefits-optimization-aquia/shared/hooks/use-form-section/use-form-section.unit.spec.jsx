import { act, renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import sinon from 'sinon';
import { z } from 'zod';

import { useFormSection } from './use-form-section';

describe('useFormSection - Form section state management', () => {
  const testSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    age: z.number().min(18, 'Must be at least 18'),
  });

  const defaultData = {
    firstName: '',
    lastName: '',
    age: 0,
  };

  describe('initialization', () => {
    it('provides default values', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      expect(result.current.localData).to.deep.equal(defaultData);
      expect(result.current.namespace).to.equal('personal');
      expect(result.current.formSubmitted).to.be.false;
    });

    it('restores saved data', () => {
      const parentData = {
        personal: {
          firstName: 'John',
          age: 25,
        },
      };

      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
          data: parentData,
        }),
      );

      expect(result.current.localData).to.deep.equal({
        firstName: 'John',
        lastName: '',
        age: 25,
      });
    });

    it('use custom namespace when provided', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
          customNamespace: 'customSection',
        }),
      );

      expect(result.current.namespace).to.equal('customSection');
    });

    it('apply data processor to initial data', () => {
      const dataProcessor = sinon.spy(data => ({
        ...data,
        processed: true,
      }));

      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
          dataProcessor,
        }),
      );

      expect(dataProcessor.calledOnce).to.be.true;
      expect(result.current.localData).to.have.property('processed', true);
    });
  });

  describe('when veteran enters information into form fields', () => {
    it('updates form data as veteran types into text fields', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      act(() => {
        result.current.handleFieldChange('firstName', 'Jane');
      });

      expect(result.current.localData.firstName).to.equal('Jane');
    });

    it('update nested fields using dot notation', () => {
      const nestedSchema = z.object({
        address: z.object({
          street: z.string(),
          city: z.string(),
        }),
      });

      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'contact',
          schema: nestedSchema,
          defaultData: { address: { street: '', city: '' } },
        }),
      );

      act(() => {
        result.current.handleFieldChange('address.street', '123 Main St');
      });

      expect(result.current.localData.address.street).to.equal('123 Main St');
    });

    it('call setFormData with namespaced data', () => {
      const setFormData = sinon.spy();
      const data = { existingField: 'value' };

      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
          data,
          setFormData,
        }),
      );

      act(() => {
        result.current.handleFieldChange('firstName', 'John');
      });

      expect(setFormData.calledOnce).to.be.true;
      const callArg = setFormData.firstCall.args[0];
      expect(callArg).to.have.property('existingField', 'value');
      expect(callArg).to.have.nested.property('personal.firstName', 'John');
    });

    it('handle null values', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      act(() => {
        result.current.handleFieldChange('firstName', null);
      });

      expect(result.current.localData.firstName).to.equal('');
    });

    it('handle array values', () => {
      const arraySchema = z.object({
        items: z.array(z.string()),
      });

      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'list',
          schema: arraySchema,
          defaultData: { items: [] },
        }),
      );

      act(() => {
        result.current.handleFieldChange('items', ['a', 'b', 'c']);
      });

      expect(result.current.localData.items).to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('when validating veteran input', () => {
    it('shows validation errors after veteran interacts with invalid fields', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      // Simulate form submission attempt to enable validation
      act(() => {
        result.current.setFormSubmitted(true);
      });

      // Initially, hasInitialized is false, so no validation yet
      // But after first render effect, it validates
      act(() => {
        // Trigger a change to validate
        result.current.handleFieldChange('firstName', 'John');
      });

      // Should validate after change
      act(() => {
        result.current.handleFieldChange('firstName', '');
      });

      // Should have validation error for firstName
      expect(result.current.errors).to.have.property('firstName');
    });

    it('clear errors when field becomes valid', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      // Simulate form submission attempt to enable validation
      act(() => {
        result.current.setFormSubmitted(true);
      });

      // Create an error
      act(() => {
        result.current.handleFieldChange('firstName', 'John');
        result.current.handleFieldChange('firstName', '');
      });

      expect(result.current.errors).to.have.property('firstName');

      // Fix the error
      act(() => {
        result.current.handleFieldChange('firstName', 'Jane');
      });

      // Validation happens but might still have other field errors
      expect(result.current.errors).to.not.have.property(
        'firstName',
        'First name is required',
      );
    });

    it('expose validate function', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
      };

      act(() => {
        result.current.setLocalData(validData);
      });

      act(() => {
        const isValid = result.current.validate(validData);
        expect(isValid).to.be.true;
      });

      expect(result.current.errors).to.deep.equal({});
    });

    it('expose validateField function', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      act(() => {
        const isValid = result.current.validateField('firstName', 'John');
        expect(isValid).to.be.true;
      });

      act(() => {
        const isValid = result.current.validateField('firstName', '');
        expect(isValid).to.be.false;
      });
    });
  });

  describe('when veteran clicks Continue button', () => {
    it('advances to next page when all required fields are complete and valid', () => {
      const goForward = sinon.spy();
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
      };

      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData: validData,
        }),
      );

      act(() => {
        result.current.handleContinue(goForward);
      });

      expect(result.current.formSubmitted).to.be.true;
      expect(goForward.calledOnce).to.be.true;
      const callArg = goForward.firstCall.args[0];
      expect(callArg).to.have.nested.property('personal.firstName', 'John');
    });

    it('not call goForward if validation fails', () => {
      const goForward = sinon.spy();

      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      act(() => {
        result.current.handleContinue(goForward);
      });

      expect(result.current.formSubmitted).to.be.true;
      expect(goForward.called).to.be.false;
      expect(result.current.errors).to.not.be.empty;
    });

    it('set formSubmitted to true', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      expect(result.current.formSubmitted).to.be.false;

      act(() => {
        result.current.handleContinue(() => {});
      });

      expect(result.current.formSubmitted).to.be.true;
    });

    it('pass namespaced data to goForward', () => {
      const goForward = sinon.spy();
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
      };
      const existingData = { otherSection: { field: 'value' } };

      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData: validData,
          data: existingData,
        }),
      );

      act(() => {
        result.current.handleContinue(goForward);
      });

      const passedData = goForward.firstCall.args[0];
      expect(passedData).to.have.property('otherSection');
      expect(passedData).to.have.property('personal');
      expect(passedData.personal).to.deep.equal(validData);
    });
  });

  describe('setFormSubmitted', () => {
    it('allow manually setting formSubmitted', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      expect(result.current.formSubmitted).to.be.false;

      act(() => {
        result.current.setFormSubmitted(true);
      });

      expect(result.current.formSubmitted).to.be.true;

      act(() => {
        result.current.setFormSubmitted(false);
      });

      expect(result.current.formSubmitted).to.be.false;
    });
  });

  describe('clearErrors', () => {
    it('clear all validation errors', () => {
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
        }),
      );

      // Create some errors
      act(() => {
        result.current.validate({});
      });

      expect(result.current.errors).to.not.be.empty;

      // Clear errors
      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.errors).to.deep.equal({});
    });
  });

  describe('complex scenarios', () => {
    it('handle form with nested objects and arrays', () => {
      const complexSchema = z.object({
        user: z.object({
          name: z.string().min(1),
          emails: z.array(z.string().email()),
        }),
        preferences: z.object({
          notifications: z.boolean(),
          theme: z.enum(['light', 'dark']),
        }),
      });

      const complexDefault = {
        user: {
          name: '',
          emails: [],
        },
        preferences: {
          notifications: false,
          theme: 'light',
        },
      };

      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'settings',
          schema: complexSchema,
          defaultData: complexDefault,
        }),
      );

      act(() => {
        result.current.handleFieldChange('user.name', 'John');
        result.current.handleFieldChange('user.emails', ['john@example.com']);
        result.current.handleFieldChange('preferences.theme', 'dark');
      });

      expect(result.current.localData.user.name).to.equal('John');
      expect(result.current.localData.user.emails).to.deep.equal([
        'john@example.com',
      ]);
      expect(result.current.localData.preferences.theme).to.equal('dark');
    });

    it('handle rapid successive updates', () => {
      const setFormData = sinon.spy();
      const { result } = renderHook(() =>
        useFormSection({
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
          setFormData,
        }),
      );

      act(() => {
        result.current.handleFieldChange('firstName', 'J');
        result.current.handleFieldChange('firstName', 'Jo');
        result.current.handleFieldChange('firstName', 'Joh');
        result.current.handleFieldChange('firstName', 'John');
      });

      expect(result.current.localData.firstName).to.equal('John');
      expect(setFormData.callCount).to.equal(4);
    });

    it('update handlers when dependencies change', () => {
      const { result, rerender } = renderHook(props => useFormSection(props), {
        initialProps: {
          sectionName: 'personal',
          schema: testSchema,
          defaultData,
          data: {},
        },
      });

      const firstHandleFieldChange = result.current.handleFieldChange;
      const firstHandleContinue = result.current.handleContinue;

      rerender({
        sectionName: 'personal',
        schema: testSchema,
        defaultData,
        data: { newField: 'value' },
      });

      expect(result.current.handleFieldChange).to.not.equal(
        firstHandleFieldChange,
      );
      expect(result.current.handleContinue).to.not.equal(firstHandleContinue);
    });
  });
});
