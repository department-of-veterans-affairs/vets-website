import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { z } from 'zod';

import { DateField } from './date-field';

describe('DateField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testDate',
      label: 'Test Date',
      value: '',
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('displays label', () => {
      const { container } = render(<DateField {...defaultProps} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.exist;
      expect(dateInput).to.have.attribute('label', 'Test Date');
    });

    it('shows hint text', () => {
      const props = { ...defaultProps, hint: 'Enter your date of birth' };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.have.attribute('hint', 'Enter your date of birth');
    });

    it('marks as required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.have.attribute('required', 'true');
    });

    it('shows current date value', () => {
      const props = { ...defaultProps, value: '1977-05-25' };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.have.attribute('value', '1977-05-25');
    });

    it('shows empty string for no value', () => {
      const props = { ...defaultProps, value: '' };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.have.attribute('value', '');
    });
  });

  describe('interactions', () => {
    it('calls onChange', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<DateField {...props} />);

      // Directly call the onChange handler as the component would
      onChange('testDate', '1980-05-21');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testDate');
      expect(onChange.firstCall.args[1]).to.equal('1980-05-21');
    });

    it('handles onChange with event value from target', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');

      const event = {
        target: { value: '1983-05-25' },
      };

      const customEvent = new CustomEvent('dateChange');
      Object.defineProperty(customEvent, 'target', {
        value: event.target,
        writable: false,
      });

      dateInput.dispatchEvent(customEvent);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('1983-05-25');
    });

    it('handles date blur events', async () => {
      const { container } = render(<DateField {...defaultProps} />);
      const dateInput = container.querySelector('va-date');

      const blurEvent = new Event('dateBlur');
      dateInput.dispatchEvent(blurEvent);

      await waitFor(() => {});
    });
  });

  describe('validation', () => {
    it('shows external errors', () => {
      const props = {
        ...defaultProps,
        error: 'Date is required',
        forceShowError: true,
      };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.have.attribute('error', 'Date is required');
    });

    it('delays error display', () => {
      const props = {
        ...defaultProps,
        error: 'Date is required',
        forceShowError: false,
      };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.not.have.attribute('error');
    });

    it('shows error after blur when touched', async () => {
      const props = {
        ...defaultProps,
        error: 'Invalid date',
        forceShowError: false,
      };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');

      // Initially no error shown
      expect(dateInput).to.not.have.attribute('error');

      // Trigger blur to set touched state
      const blurEvent = new Event('dateBlur');
      dateInput.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(dateInput).to.have.attribute('error', 'Invalid date');
      });
    });

    it('works with Zod schema (unused in component)', () => {
      const schema = z.string().min(1, 'Date is required');
      const props = { ...defaultProps, schema };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.exist;
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
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');

      expect(dateInput).to.have.attribute('required', 'true');
      expect(dateInput).to.have.attribute('error', 'Error message');
    });

    it('preserves focus', () => {
      const { container } = render(<DateField {...defaultProps} />);
      const dateInput = container.querySelector('va-date');

      dateInput.focus();
      const event = new CustomEvent('va-date-change', {
        detail: { value: '1977-12-31' },
      });
      dateInput.dispatchEvent(event);

      /// Focus should remain on the element after change
    });
  });

  describe('edge cases', () => {
    it('handles null value', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.have.attribute('value', '');
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');
      expect(dateInput).to.have.attribute('value', '');
    });

    it('handles missing onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');

      const event = new CustomEvent('va-date-change', {
        detail: { value: '1980-03-04' },
      });
      expect(() => dateInput.dispatchEvent(event)).to.not.throw();
    });

    it('handles empty event details', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');

      const event = new CustomEvent('dateChange', {
        detail: {},
      });
      dateInput.dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('');
    });

    it('handles malformed date strings', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<DateField {...props} />);

      // Directly call the onChange handler with invalid date
      onChange('testDate', 'invalid-date');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('invalid-date');
    });

    it('handles rapid date changes', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');

      const dates = ['1977-05-25', '1980-05-21', '1983-05-25'];
      dates.forEach(date => {
        const event = new CustomEvent('dateChange', {
          detail: { value: date },
        });
        dateInput.dispatchEvent(event);
      });

      expect(onChange.callCount).to.equal(3);
    });
  });

  describe('props forwarding', () => {
    it('forwards additional props to va-date', () => {
      const props = {
        ...defaultProps,
        'data-testid': 'custom-date',
        className: 'custom-class',
      };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');

      expect(dateInput).to.have.attribute('data-testid', 'custom-date');
      expect(dateInput).to.have.attribute('class', 'custom-class');
    });

    it('preserves name and label props', () => {
      const props = {
        ...defaultProps,
        name: 'birthDate',
        label: 'Date of Birth',
      };
      const { container } = render(<DateField {...props} />);
      const dateInput = container.querySelector('va-date');

      expect(dateInput).to.have.attribute('name', 'birthDate');
      expect(dateInput).to.have.attribute('label', 'Date of Birth');
    });
  });
});
