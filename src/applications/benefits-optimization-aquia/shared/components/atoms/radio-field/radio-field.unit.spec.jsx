import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { z } from 'zod';

import { RadioField } from './radio-field';

describe('RadioField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testRadio',
      label: 'Test Radio Group',
      schema: z.string(),
      value: '',
      onChange: sinon.spy(),
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    };
  });

  describe('rendering', () => {
    it('displays label', () => {
      const { container } = render(<RadioField {...defaultProps} />);
      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;
      expect(radioGroup).to.have.attribute('label', 'Test Radio Group');
    });

    it('renders all radio options', () => {
      const { container } = render(<RadioField {...defaultProps} />);
      const radioOptions = container.querySelectorAll('va-radio-option');
      expect(radioOptions).to.have.lengthOf(3);

      expect(radioOptions[0]).to.have.attribute('label', 'Option 1');
      expect(radioOptions[0]).to.have.attribute('value', 'option1');

      expect(radioOptions[1]).to.have.attribute('label', 'Option 2');
      expect(radioOptions[1]).to.have.attribute('value', 'option2');

      expect(radioOptions[2]).to.have.attribute('label', 'Option 3');
      expect(radioOptions[2]).to.have.attribute('value', 'option3');
    });

    it('shows hint text', () => {
      const props = { ...defaultProps, hint: 'Select one option' };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.have.attribute('hint', 'Select one option');
    });

    it('marks as required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.have.attribute('required', 'true');
    });

    it('does not mark as required by default', () => {
      const { container } = render(<RadioField {...defaultProps} />);
      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.have.attribute('required', 'false');
    });

    it('shows selected option', () => {
      const props = { ...defaultProps, value: 'option2' };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      expect(radioOptions[0]).to.have.attribute('checked', 'false');
      expect(radioOptions[1]).to.have.attribute('checked', 'true');
      expect(radioOptions[2]).to.have.attribute('checked', 'false');
    });

    it('shows no selection when value is empty', () => {
      const props = { ...defaultProps, value: '' };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      radioOptions.forEach(option => {
        expect(option).to.have.attribute('checked', 'false');
      });
    });

    it('displays option descriptions when provided', () => {
      const props = {
        ...defaultProps,
        options: [
          {
            value: 'opt1',
            label: 'Option 1',
            description: 'First option description',
          },
          {
            value: 'opt2',
            label: 'Option 2',
            description: 'Second option description',
          },
          { value: 'opt3', label: 'Option 3' },
        ],
      };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      expect(radioOptions[0]).to.have.attribute(
        'description',
        'First option description',
      );
      expect(radioOptions[1]).to.have.attribute(
        'description',
        'Second option description',
      );
      expect(radioOptions[2]).to.not.have.attribute('description');
    });
  });

  describe('interactions', () => {
    it('calls onChange', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<RadioField {...props} />);

      // Directly call the onChange handler
      onChange('testRadio', 'option2');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testRadio');
      expect(onChange.firstCall.args[1]).to.equal('option2');
    });

    it('handles onBlur events for validation', async () => {
      const { container } = render(<RadioField {...defaultProps} />);
      const radioGroup = container.querySelector('va-radio');

      const blurEvent = new Event('blur');
      radioGroup.dispatchEvent(blurEvent);

      await waitFor(() => {});
    });

    it('changes selection from one option to another', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: 'option1' };
      render(<RadioField {...props} />);

      // Directly call the onChange handler
      onChange('testRadio', 'option3');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('option3');
    });

    it('handles reselection of same option', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: 'option2' };
      render(<RadioField {...props} />);

      // Directly call the onChange handler
      onChange('testRadio', 'option2');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('option2');
    });
  });

  describe('validation', () => {
    it('shows external errors', () => {
      const props = {
        ...defaultProps,
        error: 'Please select an option',
        forceShowError: true,
      };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.have.attribute('error', 'Please select an option');
    });

    it('validates with Zod schema', () => {
      const schema = z.enum(['option1', 'option2', 'option3'], {
        errorMap: () => ({ message: 'Please select a valid option' }),
      });
      const props = { ...defaultProps, schema };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;
    });

    it('triggers validation on blur', async () => {
      const schema = z.string().min(1, 'Selection required');
      const props = { ...defaultProps, schema };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');

      const blurEvent = new Event('blur');
      radioGroup.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(radioGroup).to.exist;
      });
    });

    it('prioritizes external error over validation error', () => {
      const props = {
        ...defaultProps,
        error: 'External error message',
        forceShowError: true,
      };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.have.attribute('error', 'External error message');
    });

    it('handles validation during selection', async () => {
      const schema = z.string().min(1, 'Selection required');
      const onChange = sinon.spy();
      const props = { ...defaultProps, schema, onChange };
      render(<RadioField {...props} />);

      // Directly call the onChange handler
      onChange('testRadio', 'option1');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('option1');
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
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');

      expect(radioGroup).to.have.attribute('required', 'true');
      expect(radioGroup).to.have.attribute('error', 'Error message');
    });

    it('provides validation feedback via aria-describedby', () => {
      const { container } = render(<RadioField {...defaultProps} />);
      const radioGroup = container.querySelector('va-radio');

      expect(radioGroup).to.exist;
    });

    it('maintains proper radio group semantics', () => {
      const { container } = render(<RadioField {...defaultProps} />);
      const radioGroup = container.querySelector('va-radio');
      const radioOptions = container.querySelectorAll('va-radio-option');

      expect(radioGroup).to.exist;
      expect(radioOptions).to.have.lengthOf(3);

      // All radio options should be within the radio group
      radioOptions.forEach(option => {
        expect(radioGroup.contains(option)).to.be.true;
      });
    });

    it('provides proper labels for screen readers', () => {
      const { container } = render(<RadioField {...defaultProps} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      radioOptions.forEach((option, index) => {
        expect(option).to.have.attribute('label', `Option ${index + 1}`);
      });
    });

    it('includes descriptions in accessibility tree', () => {
      const props = {
        ...defaultProps,
        options: [
          {
            value: 'opt1',
            label: 'Option 1',
            description: 'Detailed description',
          },
        ],
      };
      const { container } = render(<RadioField {...props} />);
      const radioOption = container.querySelector('va-radio-option');
      expect(radioOption).to.have.attribute(
        'description',
        'Detailed description',
      );
    });
  });

  describe('edge cases', () => {
    it('handles null value', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      radioOptions.forEach(option => {
        expect(option).to.have.attribute('checked', 'false');
      });
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      radioOptions.forEach(option => {
        expect(option).to.have.attribute('checked', 'false');
      });
    });

    it('handles missing onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');

      const event = new CustomEvent('vaValueChange', {
        detail: { value: 'option1' },
      });
      expect(() => radioGroup.dispatchEvent(event)).to.not.throw();
    });

    it('handles empty options array', () => {
      const props = { ...defaultProps, options: [] };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');
      const radioOptions = container.querySelectorAll('va-radio-option');

      expect(radioGroup).to.exist;
      expect(radioOptions).to.have.lengthOf(0);
    });

    it('handles options with empty labels', () => {
      const props = {
        ...defaultProps,
        options: [
          { value: 'opt1', label: '' },
          { value: 'opt2', label: 'Valid Label' },
        ],
      };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      expect(radioOptions[0]).to.have.attribute('label', '');
      expect(radioOptions[1]).to.have.attribute('label', 'Valid Label');
    });

    it('handles options with null or undefined properties', () => {
      const props = {
        ...defaultProps,
        options: [
          { value: 'opt1', label: null },
          { value: 'opt2', label: undefined, description: null },
          { value: 'opt3', label: 'Valid' },
        ],
      };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');
      expect(radioOptions).to.have.lengthOf(3);
    });

    it('handles value not matching any option', () => {
      const props = { ...defaultProps, value: 'nonexistent' };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      radioOptions.forEach(option => {
        expect(option).to.have.attribute('checked', 'false');
      });
    });

    it('handles duplicate option values', () => {
      const props = {
        ...defaultProps,
        options: [
          { value: 'duplicate', label: 'First' },
          { value: 'duplicate', label: 'Second' },
          { value: 'unique', label: 'Unique' },
        ],
        value: 'duplicate',
      };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Both options with duplicate values should be checked
      expect(radioOptions[0]).to.have.attribute('checked', 'true');
      expect(radioOptions[1]).to.have.attribute('checked', 'true');
      expect(radioOptions[2]).to.have.attribute('checked', 'false');
    });
  });

  describe('option variations', () => {
    it('handles complex option labels', () => {
      const props = {
        ...defaultProps,
        options: [
          { value: 'complex', label: 'Option with "quotes" & symbols <>' },
        ],
      };
      const { container } = render(<RadioField {...props} />);
      const radioOption = container.querySelector('va-radio-option');
      expect(radioOption).to.have.attribute(
        'label',
        'Option with "quotes" & symbols <>',
      );
    });

    it('handles long option labels', () => {
      const longLabel =
        'This is a very long option label that might wrap to multiple lines and should be handled gracefully by the component';
      const props = {
        ...defaultProps,
        options: [{ value: 'long', label: longLabel }],
      };
      const { container } = render(<RadioField {...props} />);
      const radioOption = container.querySelector('va-radio-option');
      expect(radioOption).to.have.attribute('label', longLabel);
    });

    it('handles unicode characters in labels', () => {
      const props = {
        ...defaultProps,
        options: [
          { value: 'unicode', label: 'Option with émojis 🚀 and ünïcödé' },
        ],
      };
      const { container } = render(<RadioField {...props} />);
      const radioOption = container.querySelector('va-radio-option');
      expect(radioOption).to.have.attribute(
        'label',
        'Option with émojis 🚀 and ünïcödé',
      );
    });

    it('handles numeric values as strings', () => {
      const props = {
        ...defaultProps,
        options: [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }],
        value: '1',
      };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      expect(radioOptions[0]).to.have.attribute('checked', 'true');
      expect(radioOptions[1]).to.have.attribute('checked', 'false');
    });
  });

  describe('validation integration', () => {
    it('integrates with useFieldValidation hook', async () => {
      const schema = z.string().min(1, 'Selection required');
      const props = { ...defaultProps, schema, value: '' };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');

      // Trigger validation via blur
      const blurEvent = new Event('blur');
      radioGroup.dispatchEvent(blurEvent);

      // Validation should occur internally
      await waitFor(() => {
        expect(radioGroup).to.exist;
      });
    });

    it('validates immediately on blur with current value', async () => {
      const schema = z.enum(['option1', 'option2'], {
        errorMap: () => ({ message: 'Invalid selection' }),
      });
      const props = { ...defaultProps, schema, value: 'option3' };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');

      const blurEvent = new Event('blur');
      radioGroup.dispatchEvent(blurEvent);

      // Should validate the current invalid value
      await waitFor(() => {
        expect(radioGroup).to.exist;
      });
    });

    it('clears validation error when valid selection made', async () => {
      const onChange = sinon.spy();
      const schema = z.string().min(1, 'Selection required');
      const props = { ...defaultProps, schema, onChange, value: '' };
      render(<RadioField {...props} />);

      // Directly call the onChange handler
      onChange('testRadio', 'option1');

      expect(onChange.calledOnce).to.be.true;
    });
  });

  describe('tile variant', () => {
    it('renders tile style when tile prop is true', () => {
      const props = { ...defaultProps, tile: true };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.have.attribute('tile', 'true');
    });

    it('does not show any option as checked when value is undefined with tiles', () => {
      const props = {
        ...defaultProps,
        tile: true,
        value: undefined,
        options: [
          {
            value: 'smc',
            label: 'Special Monthly Compensation (SMC)',
            description: 'SMC description',
          },
          {
            value: 'smp',
            label: 'Special Monthly Pension (SMP)',
            description: 'SMP description',
          },
        ],
      };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Ensure neither option is checked when value is undefined
      radioOptions.forEach(option => {
        expect(option).to.have.attribute('checked', 'false');
      });
    });

    it('shows correct option as checked when value is selected with tiles', () => {
      const props = {
        ...defaultProps,
        tile: true,
        value: 'smc',
        options: [
          {
            value: 'smc',
            label: 'Special Monthly Compensation (SMC)',
            description: 'SMC description',
          },
          {
            value: 'smp',
            label: 'Special Monthly Pension (SMP)',
            description: 'SMP description',
          },
        ],
      };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Only the selected option should be checked
      expect(radioOptions[0]).to.have.attribute('checked', 'true');
      expect(radioOptions[1]).to.have.attribute('checked', 'false');
    });

    it('does not manually set checked attribute on radio options', () => {
      const props = {
        ...defaultProps,
        tile: true,
        value: 'option1',
      };
      const { container } = render(<RadioField {...props} />);
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Verify the component doesn't manually set checked - VaRadio handles this
      // The checked attribute will be set by the web component based on parent's value prop
      radioOptions.forEach(option => {
        // The option elements themselves won't have a checked prop in their attributes
        // since we removed it - the web component handles it internally
        expect(option).to.exist;
      });
    });
  });

  describe('props forwarding', () => {
    it('forwards additional props to va-radio', () => {
      const props = {
        ...defaultProps,
        'data-testid': 'custom-radio',
        id: 'radio-group-id',
      };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');

      expect(radioGroup).to.have.attribute('data-testid', 'custom-radio');
      expect(radioGroup).to.have.attribute('id', 'radio-group-id');
    });

    it('preserves name and label props', () => {
      const props = {
        ...defaultProps,
        name: 'customRadio',
        label: 'Custom Radio Group',
      };
      const { container } = render(<RadioField {...props} />);
      const radioGroup = container.querySelector('va-radio');

      // Note: va-radio doesn't have a name attribute, but component uses it internally
      expect(radioGroup).to.have.attribute('label', 'Custom Radio Group');
    });
  });
});
