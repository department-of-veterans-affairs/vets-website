import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { CheckboxGroupField } from './checkbox-group-field';

describe('CheckboxGroupField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testCheckboxGroup',
      label: 'Test Checkbox Group',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        {
          value: 'option3',
          label: 'Option 3',
          description: 'Description for option 3',
        },
      ],
      value: [],
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('displays label', () => {
      const { container } = render(<CheckboxGroupField {...defaultProps} />);
      const group = container.querySelector('va-checkbox-group');
      expect(group).to.exist;
      expect(group).to.have.attribute('label', 'Test Checkbox Group');
    });

    it('renders all checkbox options', () => {
      const { container } = render(<CheckboxGroupField {...defaultProps} />);
      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes).to.have.lengthOf(3);
      expect(checkboxes[0]).to.have.attribute('label', 'Option 1');
      expect(checkboxes[1]).to.have.attribute('label', 'Option 2');
      expect(checkboxes[2]).to.have.attribute('label', 'Option 3');
    });

    it('displays option descriptions', () => {
      const { container } = render(<CheckboxGroupField {...defaultProps} />);
      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes[2]).to.have.attribute(
        'checkbox-description',
        'Description for option 3',
      );
    });

    it('shows hint text', () => {
      const props = { ...defaultProps, hint: 'Select all that apply' };
      const { container } = render(<CheckboxGroupField {...props} />);
      const group = container.querySelector('va-checkbox-group');
      expect(group).to.have.attribute('hint', 'Select all that apply');
    });

    it('marks as required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<CheckboxGroupField {...props} />);
      const group = container.querySelector('va-checkbox-group');
      expect(group).to.have.attribute('required', 'true');
    });

    it('shows selected values', () => {
      const props = { ...defaultProps, value: ['option1', 'option3'] };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes[0]).to.have.attribute('checked', 'true');
      expect(checkboxes[1]).to.have.attribute('checked', 'false');
      expect(checkboxes[2]).to.have.attribute('checked', 'true');
    });
  });

  describe('interactions', () => {
    it('adds option to selection', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: [] };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');

      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      checkboxes[0].dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testCheckboxGroup');
      expect(onChange.firstCall.args[1]).to.deep.equal(['option1']);
    });

    it('removes option from selection', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: ['option1', 'option2'],
      };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');

      const event = new CustomEvent('vaChange', {
        detail: { checked: false },
      });
      checkboxes[0].dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testCheckboxGroup');
      expect(onChange.firstCall.args[1]).to.deep.equal(['option2']);
    });

    it('handles multiple selections', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: ['option1'] };
      const { container, rerender } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');

      // Add option2
      let event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      checkboxes[1].dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.deep.equal(['option1', 'option2']);

      // Update props with new value and rerender
      onChange.reset();
      rerender(
        <CheckboxGroupField {...props} value={['option1', 'option2']} />,
      );
      const checkboxes2 = container.querySelectorAll('va-checkbox');

      // Add option3
      event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      checkboxes2[2].dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.deep.equal([
        'option1',
        'option2',
        'option3',
      ]);
    });

    it('prevents duplicate selections', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: ['option1'] };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');

      // Try to add option1 again (already selected)
      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      checkboxes[0].dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.deep.equal(['option1']);
    });

    it('triggers blur event', () => {
      const { container } = render(<CheckboxGroupField {...defaultProps} />);
      const group = container.querySelector('va-checkbox-group');

      const blurEvent = new Event('blur');
      group.dispatchEvent(blurEvent);
    });
  });

  describe('error handling', () => {
    it('displays error messages', () => {
      const props = {
        ...defaultProps,
        error: 'Please select at least one option',
        forceShowError: true,
      };
      const { container } = render(<CheckboxGroupField {...props} />);
      const group = container.querySelector('va-checkbox-group');
      expect(group).to.have.attribute(
        'error',
        'Please select at least one option',
      );
    });

    it('delays error display', () => {
      const props = {
        ...defaultProps,
        error: 'Please select at least one option',
        forceShowError: false,
      };
      const { container } = render(<CheckboxGroupField {...props} />);
      const group = container.querySelector('va-checkbox-group');
      expect(group).to.not.have.attribute('error');
    });

    it('shows errors after interaction', () => {
      const props = {
        ...defaultProps,
        error: 'Please select at least one option',
        forceShowError: false,
      };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');

      // Interact with a checkbox
      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      checkboxes[0].dispatchEvent(event);

      // Re-render with touched state
      const { container: container2 } = render(
        <CheckboxGroupField {...props} />,
      );
      const group2 = container2.querySelector('va-checkbox-group');

      const blurEvent = new Event('blur');
      group2.dispatchEvent(blurEvent);
    });

    it('forces error display', () => {
      const props = {
        ...defaultProps,
        error: 'Required field',
        forceShowError: true,
      };
      const { container } = render(<CheckboxGroupField {...props} />);
      const group = container.querySelector('va-checkbox-group');

      expect(group).to.have.attribute('error', 'Required field');
    });
  });

  describe('edge cases', () => {
    it('handles null value', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).to.have.attribute('checked', 'false');
      });
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).to.have.attribute('checked', 'false');
      });
    });

    it('handles non-array value', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: 'not-an-array' };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');

      // Treat non-array as empty array
      checkboxes.forEach(checkbox => {
        expect(checkbox).to.have.attribute('checked', 'false');
      });

      // Still allow selection
      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      checkboxes[0].dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.deep.equal(['option1']);
    });

    it('handles empty options array', () => {
      const props = { ...defaultProps, options: [] };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes).to.have.lengthOf(0);
    });

    it('works without onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');

      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      expect(() => checkboxes[0].dispatchEvent(event)).to.not.throw();
    });

    it('handles rapid selections', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: [] };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');

      checkboxes.forEach((checkbox, _index) => {
        const event = new CustomEvent('vaChange', {
          detail: { checked: true },
        });
        checkbox.dispatchEvent(event);
      });

      expect(onChange.callCount).to.equal(3);
    });

    it('handles null value', () => {
      const options = [
        { value: 'option&1', label: 'Option & One' },
        { value: 'option<2', label: 'Option < Two' },
        { value: 'option"3', label: 'Option " Three' },
      ];
      const onChange = sinon.spy();
      const props = { ...defaultProps, options, onChange };
      const { container } = render(<CheckboxGroupField {...props} />);
      const checkboxes = container.querySelectorAll('va-checkbox');

      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      checkboxes[0].dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.deep.equal(['option&1']);
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
      const { container } = render(<CheckboxGroupField {...props} />);
      const group = container.querySelector('va-checkbox-group');

      expect(group).to.have.attribute('required', 'true');
      expect(group).to.have.attribute('error', 'Error message');
    });

    it('maintains proper fieldset structure', () => {
      const { container } = render(<CheckboxGroupField {...defaultProps} />);
      const group = container.querySelector('va-checkbox-group');
      const checkboxes = container.querySelectorAll('va-checkbox');

      expect(group).to.exist;
      expect(checkboxes).to.have.lengthOf(3);
      // All checkboxes should be within the group
      checkboxes.forEach(checkbox => {
        expect(group.contains(checkbox)).to.be.true;
      });
    });
  });
});
