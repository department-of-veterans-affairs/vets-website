import { renderHook, act } from '@testing-library/react-hooks';
import { expect } from 'chai';
import sinon from 'sinon';
import { z } from 'zod';

import { useFieldValidation } from './use-field-validation';

describe('useFieldValidation - Field-level validation hook', () => {
  let clock;

  beforeEach(() => {
    // Use a more specific fake timer configuration to avoid performance property issue
    clock = sinon.useFakeTimers({
      now: Date.now(),
      shouldAdvanceTime: true,
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'Date',
      ],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  describe('initialization', () => {
    it('starts without errors', () => {
      const schema = z.string().min(3);
      const { result } = renderHook(() => useFieldValidation(schema));

      expect(result.current.error).to.equal('');
      expect(result.current.touched).to.be.false;
      expect(result.current.isValidating).to.be.false;
      expect(result.current.validateField).to.be.a('function');
      expect(result.current.touchField).to.be.a('function');
    });
  });

  describe('validateField', () => {
    it('validate valid input without error', async () => {
      const schema = z.string().min(3);
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('valid');
      });

      // Fast-forward debounce timer
      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('');
    });

    it('show error for invalid input when touched', async () => {
      const schema = z.string().min(3, 'Must be at least 3 characters');
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('ab', true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('Must be at least 3 characters');
      expect(result.current.touched).to.be.true;
    });

    it('not show error if not touched', async () => {
      const schema = z.string().min(3, 'Must be at least 3 characters');
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('ab', false);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('');
      expect(result.current.touched).to.be.false;
    });

    it('debounce validation calls', () => {
      const schema = z.string().min(3);
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('a');
        result.current.validateField('ab');
        result.current.validateField('abc');
      });

      // No validation should occur yet
      expect(result.current.isValidating).to.be.false;

      act(() => {
        clock.tick(300);
      });

      // Only last validation should run
      expect(result.current.error).to.equal('');
    });

    it('handle null and undefined values', () => {
      const schema = z.string().optional();
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField(null, true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('');

      act(() => {
        result.current.validateField(undefined, true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('');
    });

    it('handle empty string validation', () => {
      const schema = z.string().min(1, 'Required');
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('', true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('Required');
    });
  });

  describe('touchField', () => {
    it('mark field as touched', () => {
      const schema = z.string();
      const { result } = renderHook(() => useFieldValidation(schema));

      expect(result.current.touched).to.be.false;

      act(() => {
        result.current.touchField();
      });

      expect(result.current.touched).to.be.true;
    });

    it('show existing error when touched', () => {
      const schema = z.string().min(3, 'Too short');
      const { result } = renderHook(() => useFieldValidation(schema));

      // Validate without touching
      act(() => {
        result.current.validateField('ab', false);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('');

      // Now touch the field
      act(() => {
        result.current.touchField();
      });

      expect(result.current.error).to.equal('Too short');
    });
  });

  describe('complex schemas', () => {
    it('validate email schema', () => {
      const schema = z.string().email('Invalid email');
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('invalid', true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('Invalid email');

      act(() => {
        result.current.validateField('valid@email.com', true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('');
    });

    it('validate number schema', () => {
      const schema = z
        .number()
        .min(0)
        .max(100);
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField(-1, true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.include('greater');

      act(() => {
        result.current.validateField(50, true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('');
    });

    it('validate boolean schema', () => {
      const schema = z.boolean().refine(val => val === true, {
        message: 'Must be checked',
      });
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField(false, true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('Must be checked');

      act(() => {
        result.current.validateField(true, true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('');
    });
  });

  describe('cleanup', () => {
    it('cancel pending validation on unmount', () => {
      const schema = z.string().min(3);
      const { result, unmount } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('ab', true);
      });

      // Unmount before debounce completes
      unmount();

      act(() => {
        clock.tick(300);
      });

      // No error should be thrown
    });

    it('handle rapid value changes', () => {
      const schema = z.string().min(3);
      const { result } = renderHook(() => useFieldValidation(schema));

      // Simulate rapid typing
      const tickClock = () => clock.tick(50);

      for (let i = 0; i < 10; i++) {
        const currentIndex = i;
        act(() => {
          result.current.validateField('a'.repeat(currentIndex), true);
        });
        act(tickClock);
      }

      // Complete final debounce
      act(() => {
        clock.tick(300);
      });

      // Should validate final value
      expect(result.current.error).to.equal('');
    });
  });

  describe('edge cases', () => {
    it('handle schema without error messages', () => {
      const schema = z.string().min(3);
      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('ab', true);
      });

      act(() => {
        clock.tick(300);
      });

      // Should have default Zod error message
      expect(result.current.error).to.include('at least');
    });

    it('handle schema transformations', () => {
      const schema = z
        .string()
        .transform(val => val.toUpperCase())
        .pipe(z.string().min(3));

      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('ab', true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.include('at least');

      act(() => {
        result.current.validateField('abc', true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('');
    });

    it('handle refinements', () => {
      const schema = z.string().refine(val => val !== 'forbidden', {
        message: 'This value is not allowed',
      });

      const { result } = renderHook(() => useFieldValidation(schema));

      act(() => {
        result.current.validateField('forbidden', true);
      });

      act(() => {
        clock.tick(300);
      });

      expect(result.current.error).to.equal('This value is not allowed');
    });
  });
});
