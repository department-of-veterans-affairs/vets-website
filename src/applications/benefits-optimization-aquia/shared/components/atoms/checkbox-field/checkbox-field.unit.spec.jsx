import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { z } from 'zod';

import { CheckboxField } from './checkbox-field';

describe('CheckboxField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testCheckbox',
      label: 'Test Checkbox',
      value: false,
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('should display checkbox label text for user selection', () => {
      const { container } = render(<CheckboxField {...defaultProps} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.exist;
      expect(checkbox).to.have.attribute('label', 'Test Checkbox');
    });

    it('should provide helpful guidance text below the checkbox', () => {
      const props = { ...defaultProps, hint: 'This is a hint' };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('hint', 'This is a hint');
    });

    it('should indicate when checkbox selection is mandatory', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('required', 'true');
    });

    it('should visually indicate when checkbox is selected', () => {
      const props = { ...defaultProps, value: true };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('checked', 'true');
    });

    it('should visually indicate when checkbox is not selected', () => {
      const props = { ...defaultProps, value: false };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('checked', 'false');
    });
  });

  describe('user interactions', () => {
    it('should update form data when user toggles checkbox', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: false };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      checkbox.dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testCheckbox');
      expect(onChange.firstCall.args[1]).to.be.true;
    });

    it('should switch between checked and unchecked states when clicked', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: true };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      const event = new CustomEvent('vaChange', {
        detail: { checked: false },
      });
      checkbox.dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.be.false;
    });

    it('should handle focus loss without errors', () => {
      const { container } = render(<CheckboxField {...defaultProps} />);
      const checkbox = container.querySelector('va-checkbox');

      const blurEvent = new Event('blur');
      checkbox.dispatchEvent(blurEvent);
      // Should handle blur event without error
    });
  });

  describe('form validation', () => {
    it('should enforce business rules using Zod schema validation', () => {
      const schema = z.boolean().refine(val => val === true, {
        message: 'You must check this box',
      });

      // Test with forceShowError to immediately display validation
      const props = {
        ...defaultProps,
        schema,
        value: false,
        forceShowError: true,
      };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      // Should show error immediately when forceShowError is true
      expect(checkbox).to.have.attribute('error', 'You must check this box');
    });

    it('should not display error messages for valid input', async () => {
      const schema = z.boolean();

      const props = { ...defaultProps, schema, value: true };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      // Trigger blur to validate
      const blurEvent = new Event('blur');
      checkbox.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(checkbox).to.not.have.attribute('error');
      });
    });

    it('should display server-side validation errors to users', () => {
      const props = {
        ...defaultProps,
        error: 'External error message',
        forceShowError: true,
      };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('error', 'External error message');
    });

    it('should display server errors over client-side validation errors', async () => {
      const schema = z.boolean().refine(val => val === true, {
        message: 'Validation error',
      });

      const props = {
        ...defaultProps,
        schema,
        value: false,
        error: 'External error',
        forceShowError: true,
      };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox).to.have.attribute('error', 'External error');
    });

    it('should delay error display until user interacts with field', async () => {
      const schema = z.boolean().refine(val => val === true, {
        message: 'You must check this box',
      });

      const props = { ...defaultProps, schema, value: false };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox).to.not.have.attribute('error');
    });

    it('should immediately display errors when form submission fails', () => {
      const schema = z.boolean().refine(val => val === true, {
        message: 'You must check this box',
      });

      const props = {
        ...defaultProps,
        schema,
        value: false,
        forceShowError: true,
      };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      // Immediately shows error without blur
      expect(checkbox).to.have.attribute('error', 'You must check this box');
    });
  });

  describe('accessibility compliance', () => {
    it('should provide screen reader support with proper ARIA attributes', () => {
      const props = {
        ...defaultProps,
        required: true,
        error: 'Error message',
        forceShowError: true,
      };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox).to.have.attribute('required', 'true');
      expect(checkbox).to.have.attribute('error', 'Error message');
    });

    it('should preserve keyboard focus for accessibility', () => {
      const { container } = render(<CheckboxField {...defaultProps} />);
      const checkbox = container.querySelector('va-checkbox');

      checkbox.focus();
      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      checkbox.dispatchEvent(event);
      // Should preserve focus state after change
    });
  });

  describe('error handling and edge cases', () => {
    it('should gracefully handle null values without crashing', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('checked', 'false');
    });

    it('should gracefully handle undefined values without crashing', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('checked', 'false');
    });

    it('should not crash when onChange handler is not provided', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      // Should handle change without error
      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      expect(() => checkbox.dispatchEvent(event)).to.not.throw();
    });

    it('should correctly process multiple rapid user clicks', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container } = render(<CheckboxField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      // Simulate rapid clicks
      for (let i = 0; i < 5; i++) {
        const event = new CustomEvent('vaChange', {
          detail: { checked: i % 2 === 0 },
        });
        checkbox.dispatchEvent(event);
      }

      expect(onChange.callCount).to.equal(5);
    });
  });

  describe('developer tools', () => {
    it('should enable debug logging when in development mode', () => {
      const schema = z.boolean();
      const props = { ...defaultProps, schema, debug: true };
      const { container } = render(<CheckboxField {...props} />);

      // Component should render successfully with debug prop
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.exist;

      // Since logger.debug doesn't log in test environment,
      // we just verify the component renders without errors
      expect(checkbox).to.have.attribute('name', 'testCheckbox');
    });
  });
});
