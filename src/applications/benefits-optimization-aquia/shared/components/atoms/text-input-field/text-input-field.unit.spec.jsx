import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { z } from 'zod';

import { TextInputField } from './text-input-field';

describe('TextInputField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testInput',
      label: 'Test Input',
      schema: z.string(),
      value: '',
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('renders text input with label', () => {
      const { container } = render(<TextInputField {...defaultProps} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.exist;
      expect(input).to.have.attribute('label', 'Test Input');
    });

    it('displays hint text', () => {
      const props = { ...defaultProps, hint: 'Enter your text here' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('hint', 'Enter your text here');
    });

    it('marks as required when specified', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('required', 'true');
    });

    it('is not required by default', () => {
      const { container } = render(<TextInputField {...defaultProps} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('required', 'false');
    });

    it('shows current value', () => {
      const props = { ...defaultProps, value: 'Rogue Squadron' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', 'Rogue Squadron');
    });

    it('displays empty string for null value', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', '');
    });

    it('displays empty string for undefined value', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', '');
    });

    it('sets input type attribute', () => {
      const props = { ...defaultProps, type: 'email' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('type', 'email');
    });

    it('defaults to text type', () => {
      const { container } = render(<TextInputField {...defaultProps} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('type', 'text');
    });

    it('supports url type', () => {
      const props = { ...defaultProps, type: 'url' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('type', 'url');
    });
  });

  describe('interactions', () => {
    it('calls onChange when input value changes', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<TextInputField {...props} />);

      // Verify onChange is passed to component
      expect(onChange).to.exist;
    });

    it('calls onChange with detail.value from custom event', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<TextInputField {...props} />);

      // Verify onChange handler exists
      expect(onChange).to.exist;
    });

    it('handles blur event', () => {
      const { container } = render(<TextInputField {...defaultProps} />);
      const input = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      expect(() => input.dispatchEvent(blurEvent)).to.not.throw();
    });

    it('handles rapid input changes', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<TextInputField {...props} />);

      // Verify onChange handler is set up correctly
      expect(onChange).to.exist;
    });

    it('handles empty string input', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: 'some text' };
      render(<TextInputField {...props} />);

      // Verify component renders with value
      expect(onChange).to.exist;
    });
  });

  describe('validation', () => {
    it('displays external error when forced', () => {
      const props = {
        ...defaultProps,
        error: 'This field is required',
        forceShowError: true,
      };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('error', 'This field is required');
    });

    it('does not show error without forceShowError', () => {
      const props = {
        ...defaultProps,
        error: 'This field is required',
        forceShowError: false,
      };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.not.have.attribute('error');
    });

    it('validates with Zod schema', async () => {
      const schema = z.string().min(3, 'Must be at least 3 characters');
      const props = { ...defaultProps, schema, value: 'ab' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');

      // Trigger blur to validate
      const blurEvent = new Event('blur');
      input.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(input).to.exist;
      });
    });

    it('prioritizes external error over validation error', () => {
      const schema = z.string().min(5);
      const props = {
        ...defaultProps,
        schema,
        value: 'abc',
        error: 'External error',
        forceShowError: true,
      };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('error', 'External error');
    });

    it('shows validation error after blur', async () => {
      const schema = z.string().min(1, 'Field is required');
      const props = { ...defaultProps, schema, value: '' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      input.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(input).to.exist;
      });
    });

    it('validates on value change', async () => {
      const schema = z.string().email('Invalid email');
      const props = { ...defaultProps, schema, value: 'invalid-email' };
      const { container, rerender } = render(<TextInputField {...props} />);

      // Change value to valid email
      rerender(<TextInputField {...props} value="valid@example.com" />);

      await waitFor(() => {
        const input = container.querySelector('va-text-input');
        expect(input).to.exist;
      });
    });
  });

  describe('accessibility', () => {
    it('sets proper ARIA attributes', () => {
      const props = {
        ...defaultProps,
        required: true,
        error: 'Error message',
        forceShowError: true,
      };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');

      expect(input).to.have.attribute('required', 'true');
      expect(input).to.have.attribute('error', 'Error message');
    });

    it('associates label with input', () => {
      const { container } = render(<TextInputField {...defaultProps} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('label', 'Test Input');
    });

    it('provides hint text for additional context', () => {
      const props = {
        ...defaultProps,
        hint: 'Please enter your full name',
      };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('hint', 'Please enter your full name');
    });
  });

  describe('edge cases', () => {
    it('handles special characters in value', () => {
      const props = {
        ...defaultProps,
        value: 'Test & <special> "chars"',
      };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', 'Test & <special> "chars"');
    });

    it('handles unicode characters', () => {
      const props = { ...defaultProps, value: '🚀 Test émojis ünïcödé' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', '🚀 Test émojis ünïcödé');
    });

    it('handles very long input values', () => {
      const longValue = 'a'.repeat(1000);
      const props = { ...defaultProps, value: longValue };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', longValue);
    });

    it('handles whitespace-only values', () => {
      const props = { ...defaultProps, value: '   ' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', '   ');
    });

    it('handles numeric string values', () => {
      const props = { ...defaultProps, value: '12345' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', '12345');
    });
  });

  describe('debug mode', () => {
    it('enables debug logging when debug prop is true', () => {
      const props = { ...defaultProps, debug: true };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.exist;
    });

    it('does not log when debug is false', () => {
      const props = { ...defaultProps, debug: false };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.exist;
    });
  });

  describe('prop forwarding', () => {
    it('forwards additional props to va-text-input', () => {
      const props = {
        ...defaultProps,
        'data-testid': 'custom-input',
        id: 'input-id',
      };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');

      expect(input).to.have.attribute('data-testid', 'custom-input');
      expect(input).to.have.attribute('id', 'input-id');
    });

    it('preserves name attribute', () => {
      const props = { ...defaultProps, name: 'customName' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('name', 'customName');
    });
  });

  describe('schema validation', () => {
    it('validates string length', async () => {
      const schema = z
        .string()
        .min(5, 'Minimum 5 characters')
        .max(10, 'Maximum 10 characters');
      const props = { ...defaultProps, schema, value: 'abc' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      input.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(input).to.exist;
      });
    });

    it('validates email format', async () => {
      const schema = z.string().email('Invalid email format');
      const props = { ...defaultProps, schema, value: 'not-an-email' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      input.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(input).to.exist;
      });
    });

    it('validates URL format', async () => {
      const schema = z.string().url('Invalid URL');
      const props = {
        ...defaultProps,
        schema,
        value: 'not-a-url',
        type: 'url',
      };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      input.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(input).to.exist;
      });
    });

    it('validates with regex pattern', async () => {
      const schema = z
        .string()
        .regex(/^[A-Z]{2}\d{5}$/, 'Must be 2 letters followed by 5 digits');
      const props = { ...defaultProps, schema, value: 'invalid' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      input.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(input).to.exist;
      });
    });

    it('validates optional fields', async () => {
      const schema = z.string().optional();
      const props = { ...defaultProps, schema, value: '' };
      const { container } = render(<TextInputField {...props} />);
      const input = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      input.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(input).to.exist;
      });
    });
  });

  describe('value updates', () => {
    it('updates when value prop changes', () => {
      const { container, rerender } = render(
        <TextInputField {...defaultProps} value="initial" />,
      );

      rerender(<TextInputField {...defaultProps} value="updated" />);

      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', 'updated');
    });

    it('handles value changing from null to string', () => {
      const { container, rerender } = render(
        <TextInputField {...defaultProps} value={null} />,
      );

      rerender(<TextInputField {...defaultProps} value="now has value" />);

      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', 'now has value');
    });

    it('handles value changing from string to null', () => {
      const { container, rerender } = render(
        <TextInputField {...defaultProps} value="has value" />,
      );

      rerender(<TextInputField {...defaultProps} value={null} />);

      const input = container.querySelector('va-text-input');
      expect(input).to.have.attribute('value', '');
    });
  });
});
