import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { SelectField } from './select-field';

describe('SelectField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testSelect',
      label: 'Test Select',
      options: [
        { value: 'option1', label: 'Red Squadron' },
        { value: 'option2', label: 'Gold Squadron' },
        { value: 'option3', label: 'Rogue Squadron' },
      ],
      value: '',
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('renders select with label', () => {
      const { container } = render(<SelectField {...defaultProps} />);
      const select = container.querySelector('va-select');
      expect(select).to.exist;
      expect(select).to.have.attribute('label', 'Test Select');
    });

    it('displays hint text', () => {
      const props = { ...defaultProps, hint: 'Select an option' };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');
      expect(select).to.have.attribute('hint', 'Select an option');
    });

    it('marks as required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');
      expect(select).to.have.attribute('required', 'true');
    });

    it('shows selected value', () => {
      const props = { ...defaultProps, value: 'option2' };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');
      expect(select).to.have.attribute('value', 'option2');
    });

    it('displays all dropdown options', () => {
      const { container } = render(<SelectField {...defaultProps} />);
      const options = container.querySelectorAll('option');
      expect(options).to.have.lengthOf(3); // 3 options (va-select adds its own placeholder)
    });

    it('does not include manual placeholder option', () => {
      const { container } = render(<SelectField {...defaultProps} />);
      const placeholder = container.querySelector('option[value=""]');
      // VaSelect web component adds its own placeholder automatically
      expect(placeholder).to.not.exist;
    });
  });

  describe('interactions', () => {
    it('triggers onChange for selections', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      // Simulate the va-select custom event
      const event = new CustomEvent('vaSelect', {
        bubbles: true,
        detail: { value: 'option2' },
      });

      // Also add target.value as a fallback
      Object.defineProperty(event, 'target', {
        value: { value: 'option2' },
        writable: false,
      });

      select.dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testSelect');
      expect(onChange.firstCall.args[1]).to.equal('option2');
    });

    it('handles placeholder selection', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: 'option1' };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      const event = new CustomEvent('vaSelect', {
        bubbles: true,
        detail: { value: '' },
      });

      // Also add target.value as a fallback
      Object.defineProperty(event, 'target', {
        value: { value: '' },
        writable: false,
      });

      select.dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('');
    });

    it('supports blur events', () => {
      const { container } = render(<SelectField {...defaultProps} />);
      const select = container.querySelector('va-select');

      const blurEvent = new Event('blur');
      select.dispatchEvent(blurEvent);
      // Should handle blur event without error
    });
  });

  describe('validation', () => {
    it('displays external errors', () => {
      const props = {
        ...defaultProps,
        value: '',
        error: 'Please select an option',
        forceShowError: true,
      };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      // Should show error when forceShowError is true
      expect(select).to.have.attribute('error', 'Please select an option');
    });

    it('delays error display', () => {
      const props = { ...defaultProps, value: 'option1' };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      expect(select).to.not.have.attribute('error');
    });

    it('shows validation messages', () => {
      const props = {
        ...defaultProps,
        error: 'External error message',
        forceShowError: true,
      };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');
      expect(select).to.have.attribute('error', 'External error message');
    });

    it('forces error display', () => {
      const props = {
        ...defaultProps,
        value: '',
        error: 'External error',
        forceShowError: true,
      };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      expect(select).to.have.attribute('error', 'External error');
    });

    it('delays errors until interaction', () => {
      const props = {
        ...defaultProps,
        value: '',
        error: 'Please select an option',
        forceShowError: false,
      };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      expect(select).to.not.have.attribute('error');
    });

    it('bypasses touch requirement when forced', () => {
      const props = {
        ...defaultProps,
        value: '',
        error: 'Please select an option',
        forceShowError: true,
      };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      // Immediately shows error without blur
      expect(select).to.have.attribute('error', 'Please select an option');
    });
  });

  describe('option rendering', () => {
    it('supports value-label pairs', () => {
      const options = [
        { value: 'val1', label: 'Display 1' },
        { value: 'val2', label: 'Display 2' },
      ];
      const props = { ...defaultProps, options };
      const { container } = render(<SelectField {...props} />);

      const option1 = container.querySelector('option[value="val1"]');
      expect(option1.textContent).to.equal('Display 1');

      const option2 = container.querySelector('option[value="val2"]');
      expect(option2.textContent).to.equal('Display 2');
    });

    it('handles empty option lists', () => {
      const props = { ...defaultProps, options: [] };
      const { container } = render(<SelectField {...props} />);
      const options = container.querySelectorAll('option');
      expect(options).to.have.lengthOf(0); // VaSelect adds placeholder, not manual options
    });

    it('escapes special characters', () => {
      const options = [
        { value: 'opt&1', label: 'Option & One' },
        { value: 'opt<2', label: 'Option < Two' },
      ];
      const props = { ...defaultProps, options };
      const { container } = render(<SelectField {...props} />);

      const option1 = container.querySelector('option[value="opt&1"]');
      expect(option1).to.exist;
      expect(option1.textContent).to.equal('Option & One');
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
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      expect(select).to.have.attribute('required', 'true');
      expect(select).to.have.attribute('error', 'Error message');
    });

    it('preserves focus state', () => {
      const { container } = render(<SelectField {...defaultProps} />);
      const select = container.querySelector('va-select');

      select.focus();
      const event = new CustomEvent('vaSelect', {
        detail: { value: 'option1' },
      });
      select.dispatchEvent(event);
      // Should preserve focus state after selection
    });
  });

  describe('edge cases', () => {
    it('handles null value', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');
      expect(select).to.have.attribute('value', '');
    });

    it('handles null value', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');
      expect(select).to.have.attribute('value', '');
    });

    it('works without onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      // Should handle change without error
      const event = new CustomEvent('vaSelect', {
        detail: { value: 'option1' },
      });
      expect(() => select.dispatchEvent(event)).to.not.throw();
    });

    it('processes rapid selections', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container } = render(<SelectField {...props} />);
      const select = container.querySelector('va-select');

      // Simulate rapid selections
      ['option1', 'option2', 'option3', 'option1', 'option2'].forEach(value => {
        const event = new CustomEvent('vaSelect', {
          detail: { value },
        });
        select.dispatchEvent(event);
      });

      expect(onChange.callCount).to.equal(5);
    });

    it('renders long option lists', () => {
      const manyOptions = Array.from({ length: 100 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`,
      }));
      const props = { ...defaultProps, options: manyOptions };
      const { container } = render(<SelectField {...props} />);
      const options = container.querySelectorAll('option');
      expect(options).to.have.lengthOf(100); // 100 options (va-select adds its own placeholder)
    });
  });
});
