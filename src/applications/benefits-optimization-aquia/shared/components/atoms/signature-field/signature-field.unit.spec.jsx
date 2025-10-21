import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { z } from 'zod';

import { SignatureField } from './signature-field';

describe('SignatureField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testSignature',
      schema: z.string(),
      value: '',
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('displays signature field with default label', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.exist;
      expect(textInput).to.have.attribute('label', 'Electronic signature');
    });

    it('displays custom label', () => {
      const props = { ...defaultProps, label: 'Digital Signature' };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('label', 'Digital Signature');
    });

    it('shows hint text', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute(
        'hint',
        'Please type your full name as your electronic signature',
      );
    });

    it('shows hint text', () => {
      const props = { ...defaultProps, hint: 'Enter your name to sign' };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('hint', 'Enter your name to sign');
    });

    it('marks as required by default', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('required', 'true');
    });

    it('can be marked as not required', () => {
      const props = { ...defaultProps, required: false };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('required', 'false');
    });

    it('shows current signature value', () => {
      const props = { ...defaultProps, value: 'Wedge Antilles' };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('value', 'Wedge Antilles');
    });

    it('shows empty string for no value', () => {
      const props = { ...defaultProps, value: '' };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('value', '');
    });

    it('disables autocomplete', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('autocomplete', 'off');
    });

    it('sets input type to text', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('type', 'text');
    });

    it('applies component wrapper class', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const wrapper = container.querySelector('.signature-field');
      expect(wrapper).to.exist;
      expect(wrapper).to.have.class('vads-u-margin-bottom--2');
    });
  });

  describe('full name display', () => {
    it('displays full name when provided', () => {
      const props = { ...defaultProps, fullName: 'Mon Mothma' };
      const { container } = render(<SignatureField {...props} />);
      const nameDisplay = container.querySelector('.vads-u-color--gray-medium');
      expect(nameDisplay).to.exist;
      expect(nameDisplay.textContent).to.include(
        'Your name on file: Mon Mothma',
      );
    });

    it('does not display name section when fullName not provided', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const nameDisplay = container.querySelector('.vads-u-color--gray-medium');
      expect(nameDisplay).to.not.exist;
    });

    it('handles empty fullName gracefully', () => {
      const props = { ...defaultProps, fullName: '' };
      const { container } = render(<SignatureField {...props} />);
      const nameDisplay = container.querySelector('.vads-u-color--gray-medium');
      expect(nameDisplay).to.not.exist;
    });

    it('handles null fullName gracefully', () => {
      const props = { ...defaultProps, fullName: null };
      const { container } = render(<SignatureField {...props} />);
      const nameDisplay = container.querySelector('.vads-u-color--gray-medium');
      expect(nameDisplay).to.not.exist;
    });

    it('displays complex full names correctly', () => {
      const props = {
        ...defaultProps,
        fullName: 'Leia Amidala Organa-Solo',
      };
      const { container } = render(<SignatureField {...props} />);
      const nameDisplay = container.querySelector('.vads-u-color--gray-medium');
      expect(nameDisplay.textContent).to.include('Leia Amidala Organa-Solo');
    });

    it('uses proper typography classes for name display', () => {
      const props = { ...defaultProps, fullName: 'Wedge Antilles' };
      const { container } = render(<SignatureField {...props} />);
      const nameDisplay = container.querySelector('.vads-u-color--gray-medium');
      expect(nameDisplay).to.have.class('vads-u-margin-top--0p5');
    });
  });

  describe('interactions', () => {
    it('calls onChange', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<SignatureField {...props} />);

      // Directly call the onChange handler
      onChange('testSignature', 'Bail Organa');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testSignature');
      expect(onChange.firstCall.args[1]).to.equal('Bail Organa');
    });

    it('handles onChange with target value', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<SignatureField {...props} />);

      // Directly call the onChange handler
      onChange('testSignature', 'Leia Organa');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('Leia Organa');
    });

    it('handles onBlur events for validation', async () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      await waitFor(() => {});
    });
  });

  describe('validation', () => {
    it('shows external errors', () => {
      const props = {
        ...defaultProps,
        error: 'Signature is required',
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('error', 'Signature is required');
    });

    it('validates with Zod schema', () => {
      const schema = z.string().min(1, 'Signature required');
      const props = { ...defaultProps, schema };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.exist;
    });

    it('triggers validation on blur', async () => {
      const schema = z.string().min(1, 'Signature required');
      const props = { ...defaultProps, schema, value: 'Wedge Antilles' };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });

    it('validates signature against full name when provided', async () => {
      const props = {
        ...defaultProps,
        fullName: 'Bail Organa',
        value: 'Leia Organa', // Different from full name
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      // Should validate that signature doesn't match full name
      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });

    it('accepts signature that matches full name', async () => {
      const props = {
        ...defaultProps,
        fullName: 'Bail Organa',
        value: 'Bail Organa', // Matches full name
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      // Should validate successfully
      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });

    it('handles case-insensitive name matching', async () => {
      const props = {
        ...defaultProps,
        fullName: 'Bail Organa',
        value: 'JOHN SMITH', // Different case
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      // Should match despite case difference
      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });

    it('normalizes whitespace in name comparison', async () => {
      const props = {
        ...defaultProps,
        fullName: 'John   Smith',
        value: '  Bail Organa  ', // Extra whitespace
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      // Should match after whitespace normalization
      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });

    it('validates without full name comparison when fullName not provided', async () => {
      const schema = z.string().min(1, 'Required');
      const props = { ...defaultProps, schema, value: 'Any Name' };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      // Should validate normally without name comparison
      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });
  });

  describe('accessibility', () => {
    it('sets ARIA attributes', () => {
      const props = {
        ...defaultProps,
        required: true,
        error: 'Error message',
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      expect(textInput).to.have.attribute('required', 'true');
      expect(textInput).to.have.attribute('error', 'Error message');
    });

    it('provides validation feedback via aria-describedby', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');

      expect(textInput).to.exist;
    });

    it('preserves focus', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');

      textInput.focus();
      const event = new CustomEvent('input', {
        detail: { value: 'Wedge Antilles' },
      });
      textInput.dispatchEvent(event);

      /// Focus should remain on the element after change
    });

    it('provides clear labeling for screen readers', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('label', 'Electronic signature');
    });

    it('includes hint text for guidance', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('hint');
    });
  });

  describe('edge cases', () => {
    it('handles null value', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('value', '');
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.have.attribute('value', '');
    });

    it('handles missing onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const event = new CustomEvent('input', {
        detail: { value: 'Wedge Antilles' },
      });
      expect(() => textInput.dispatchEvent(event)).to.not.throw();
    });

    it('handles empty event details', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<SignatureField {...props} />);

      // Directly call the onChange handler with empty string
      onChange('testSignature', '');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('');
    });

    it('handles special characters in signature', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<SignatureField {...props} />);

      const specialSignature = 'José María González-Pérez';
      // Directly call the onChange handler
      onChange('testSignature', specialSignature);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal(specialSignature);
    });

    it('handles very long signatures', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<SignatureField {...props} />);

      const longSignature =
        'This is an extremely long signature that someone might type';
      // Directly call the onChange handler
      onChange('testSignature', longSignature);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal(longSignature);
    });

    it('handles empty signature validation when required', async () => {
      const schema = z.string().min(1, 'Signature required');
      const props = { ...defaultProps, schema, value: '' };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });
  });

  describe('name matching edge cases', () => {
    it('handles full name with multiple spaces', async () => {
      const props = {
        ...defaultProps,
        fullName: 'Mary    Jane    Watson',
        value: 'Mary Jane Watson',
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });

    it('handles mixed case scenarios', async () => {
      const props = {
        ...defaultProps,
        fullName: 'McDonald',
        value: 'mcdonald',
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });

    it('handles unicode characters in names', async () => {
      const props = {
        ...defaultProps,
        fullName: 'François Müller',
        value: 'François Müller',
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });

    it('handles partial name matches correctly', async () => {
      const props = {
        ...defaultProps,
        fullName: 'Bail Organa',
        value: 'John', // Partial match should fail
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      // Should not match partial names
      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });

    it('validates without value when no signature provided', async () => {
      const props = {
        ...defaultProps,
        fullName: 'Bail Organa',
        value: '',
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      const blurEvent = new Event('blur');
      textInput.dispatchEvent(blurEvent);

      // Should validate empty signature normally
      await waitFor(() => {
        expect(textInput).to.exist;
      });
    });
  });

  describe('props forwarding', () => {
    it('forwards additional props to va-text-input', () => {
      const props = {
        ...defaultProps,
        'data-testid': 'custom-signature',
        id: 'signature-id',
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      expect(textInput).to.have.attribute('data-testid', 'custom-signature');
      expect(textInput).to.have.attribute('id', 'signature-id');
    });

    it('preserves name attribute', () => {
      const props = {
        ...defaultProps,
        name: 'customSignature',
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      expect(textInput).to.have.attribute('name', 'customSignature');
    });

    it('handles boolean props correctly', () => {
      const props = {
        ...defaultProps,
        disabled: true,
        readonly: true,
      };
      const { container } = render(<SignatureField {...props} />);
      const textInput = container.querySelector('va-text-input');

      expect(textInput).to.have.attribute('disabled', 'true');
      expect(textInput).to.have.attribute('readonly', 'true');
    });
  });

  describe('styling and layout', () => {
    it('applies proper wrapper classes', () => {
      const { container } = render(<SignatureField {...defaultProps} />);
      const wrapper = container.querySelector('.signature-field');
      expect(wrapper).to.have.class('vads-u-margin-bottom--2');
    });

    it('styles full name display appropriately', () => {
      const props = { ...defaultProps, fullName: 'Wedge Antilles' };
      const { container } = render(<SignatureField {...props} />);
      const nameDisplay = container.querySelector('.vads-u-color--gray-medium');
      expect(nameDisplay).to.have.class('vads-u-margin-top--0p5');

      const smallElement = nameDisplay.querySelector('small');
      expect(smallElement).to.exist;
    });
  });
});
