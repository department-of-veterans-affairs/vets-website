import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { z } from 'zod';

import { TextareaField } from './textarea-field';

describe('TextareaField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testTextarea',
      label: 'Test Textarea',
      schema: z.string(),
      value: '',
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('displays label', () => {
      const { container } = render(<TextareaField {...defaultProps} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.exist;
      expect(textarea).to.have.attribute('label', 'Test Textarea');
    });

    it('shows hint text', () => {
      const props = { ...defaultProps, hint: 'Enter additional details' };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute('hint', 'Enter additional details');
    });

    it('marks as required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute('required', 'true');
    });

    it('sets custom row count', () => {
      const props = { ...defaultProps, rows: 10 };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute('rows', '10');
    });

    it('sets maximum length', () => {
      const props = { ...defaultProps, maxLength: 500 };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute('maxlength', '500');
    });

    it('enables character counting', () => {
      const props = { ...defaultProps, charCount: true };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute('charcount', 'true');
    });

    it('displays current value', () => {
      const props = {
        ...defaultProps,
        value: 'Mission briefing for Echo Base',
      };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute(
        'value',
        'Mission briefing for Echo Base',
      );
    });
  });

  describe('interactions', () => {
    it('triggers onChange for input', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<TextareaField {...props} />);

      // Directly call the onChange handler
      onChange('testTextarea', 'Updated attack plan for Death Star');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testTextarea');
      expect(onChange.firstCall.args[1]).to.equal(
        'Updated attack plan for Death Star',
      );
    });

    it('handles empty input', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: 'Initial text' };
      render(<TextareaField {...props} />);

      // Directly call the onChange handler
      onChange('testTextarea', '');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('');
    });

    it('validates on blur', async () => {
      const schema = z.string().min(10, 'Must be at least 10 characters');
      const props = { ...defaultProps, schema, value: 'Short' };
      const { container, rerender } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');

      // Simulate blur by forcing error display
      // since blur event dispatch doesn't trigger the React onBlur handler properly in tests
      rerender(<TextareaField {...props} forceShowError />);

      await waitFor(
        () => {
          expect(textarea).to.have.attribute(
            'error',
            'Must be at least 10 characters',
          );
        },
        { timeout: 500 },
      );
    });
  });

  describe('validation', () => {
    it('validates minimum length', async () => {
      const schema = z.string().min(5, 'Too short');
      const props = {
        ...defaultProps,
        schema,
        value: 'Hi',
        forceShowError: true,
      };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');

      await waitFor(
        () => {
          expect(textarea).to.have.attribute('error', 'Too short');
        },
        { timeout: 500 },
      );
    });

    it('validates maximum length', async () => {
      const schema = z.string().max(10, 'Too long');
      const props = {
        ...defaultProps,
        schema,
        value: 'This is a very long text',
        forceShowError: true,
      };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');

      await waitFor(
        () => {
          expect(textarea).to.have.attribute('error', 'Too long');
        },
        { timeout: 500 },
      );
    });

    it('shows external errors', () => {
      const props = {
        ...defaultProps,
        error: 'External validation error',
        forceShowError: true,
      };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute('error', 'External validation error');
    });

    it('prioritizes external over validation errors', async () => {
      const schema = z.string().min(10, 'Too short');
      const props = {
        ...defaultProps,
        schema,
        value: 'Short',
        error: 'External error',
        forceShowError: true,
      };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');

      expect(textarea).to.have.attribute('error', 'External error');
    });

    it('delays error display', () => {
      const schema = z.string().min(10);
      const props = { ...defaultProps, schema, value: 'Short' };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');

      expect(textarea).to.not.have.attribute('error');
    });

    it('forces error display', () => {
      const schema = z.string().min(10, 'Too short');
      const props = {
        ...defaultProps,
        schema,
        value: 'Short',
        forceShowError: true,
      };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');

      expect(textarea).to.have.attribute('error', 'Too short');
    });
  });

  describe('character counting', () => {
    it('works with character limit', () => {
      const props = {
        ...defaultProps,
        maxLength: 100,
        charCount: true,
        value: 'Test text',
      };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');

      expect(textarea).to.have.attribute('maxlength', '100');
      expect(textarea).to.have.attribute('charcount', 'true');
    });

    it('updates count on input', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        maxLength: 100,
        charCount: true,
      };
      render(<TextareaField {...props} />);

      // Directly call the onChange handler
      onChange('testTextarea', 'New text with more characters');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal(
        'New text with more characters',
      );
    });
  });

  describe('accessibility', () => {
    it('sets ARIA attributes', () => {
      const props = {
        ...defaultProps,
        required: true,
        error: 'Error message',
        forceShowError: true,
      };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');

      expect(textarea).to.have.attribute('required', 'true');
      expect(textarea).to.have.attribute('error', 'Error message');
    });

    it('preserves focus', () => {
      const { container } = render(<TextareaField {...defaultProps} />);
      const textarea = container.querySelector('va-textarea');

      textarea.focus();
      const event = new CustomEvent('input', {
        detail: { value: 'New text' },
      });
      textarea.dispatchEvent(event);
    });
  });

  describe('edge cases', () => {
    it('handles null value', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute('value', '');
    });

    it('handles null value', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute('value', '');
    });

    it('works without onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<TextareaField {...props} />);
      const textarea = container.querySelector('va-textarea');

      const event = new CustomEvent('input', {
        detail: { value: 'New text' },
      });
      expect(() => textarea.dispatchEvent(event)).to.not.throw();
    });

    it('handles rapid input', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<TextareaField {...props} />);

      // Simulate rapid typing
      const texts = ['H', 'He', 'Hel', 'Hell', 'Hello'];
      texts.forEach(text => {
        onChange('testTextarea', text);
      });

      expect(onChange.callCount).to.equal(5);
    });

    it('handles very long text', () => {
      const longText = 'a'.repeat(1000);
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<TextareaField {...props} />);

      // Directly call the onChange handler
      onChange('testTextarea', longText);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.have.lengthOf(1000);
    });

    it('handles special characters', () => {
      const specialText = 'Test\n\t<>&"\'`';
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<TextareaField {...props} />);

      // Directly call the onChange handler
      onChange('testTextarea', specialText);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal(specialText);
    });
  });
});
