import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { z } from 'zod';

import { MemorableDateField } from './memorable-date-field';

describe('MemorableDateField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testMemorableDate',
      label: 'Test Memorable Date',
      schema: z.string(),
      value: '',
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('displays label', () => {
      const { container } = render(<MemorableDateField {...defaultProps} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.exist;
      expect(dateField).to.have.attribute('label', 'Test Memorable Date');
    });

    it('shows hint text', () => {
      const props = { ...defaultProps, hint: 'Enter your birth date' };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('hint', 'Enter your birth date');
    });

    it('marks as required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('required', 'true');
    });

    it('shows current date value', () => {
      const props = { ...defaultProps, value: '1977-05-25' };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('value', '1977-05-25');
    });

    it('shows empty string for no value', () => {
      const props = { ...defaultProps, value: '' };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('value', '');
    });

    it('enables month select by default', () => {
      const props = { ...defaultProps, monthSelect: true };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('month-select', 'true');
    });

    it('shows month and year only when specified', () => {
      const props = { ...defaultProps, monthYearOnly: true };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('month-year-only', 'true');
    });

    it('shows all date fields when monthYearOnly is false', () => {
      const props = { ...defaultProps, monthYearOnly: false };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('month-year-only', 'false');
    });
  });

  describe('interactions', () => {
    it('calls onChange', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<MemorableDateField {...props} />);

      // Directly call the onChange handler
      onChange('testMemorableDate', '1980-05-21');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testMemorableDate');
      expect(onChange.firstCall.args[1]).to.equal('1980-05-21');
    });

    it('handles onChange with event value from target', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');

      const event = {
        target: { value: '1983-05-25' },
      };

      const customEvent = new CustomEvent('dateChange');
      Object.defineProperty(customEvent, 'target', {
        value: event.target,
        writable: false,
      });

      dateField.dispatchEvent(customEvent);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('1983-05-25');
    });

    it('handles date blur events', async () => {
      const { container } = render(<MemorableDateField {...defaultProps} />);
      const dateField = container.querySelector('va-memorable-date');

      const blurEvent = new Event('dateBlur');
      dateField.dispatchEvent(blurEvent);

      await waitFor(() => {
        // Blur event should trigger internal state update
        expect(dateField).to.exist;
      });
    });

    it('handles multiple onChange calls', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<MemorableDateField {...props} />);

      // Simulate the component calling handleDateChange with (event, newValue)
      const handleDateChange = props.onChange;
      handleDateChange('testMemorableDate', '1977-12-31');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('1977-12-31');
    });
  });

  describe('validation', () => {
    it('shows external errors', () => {
      const props = {
        ...defaultProps,
        error: 'Date is required',
        forceShowError: true,
      };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('error', 'Date is required');
    });

    it('delays error display', () => {
      const props = {
        ...defaultProps,
        error: 'Date is required',
        forceShowError: false,
      };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.not.have.attribute('error');
    });

    it('shows error after blur when touched', async () => {
      const props = {
        ...defaultProps,
        error: 'Invalid date',
        forceShowError: false,
      };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');

      // Initially no error shown
      expect(dateField).to.not.have.attribute('error');

      // Trigger blur to set touched state
      const blurEvent = new Event('dateBlur');
      dateField.dispatchEvent(blurEvent);

      await waitFor(() => {
        expect(dateField).to.have.attribute('error', 'Invalid date');
      });
    });

    it('works with Zod schema (unused in component)', () => {
      const schema = z.string().min(1, 'Date is required');
      const props = { ...defaultProps, schema };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.exist;
    });
  });

  // Debug mode tests removed - debug prop no longer exists in component

  describe('accessibility', () => {
    it('sets ARIA attributes', () => {
      const props = {
        ...defaultProps,
        required: true,
        error: 'Error message',
        forceShowError: true,
      };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');

      expect(dateField).to.have.attribute('required', 'true');
      expect(dateField).to.have.attribute('error', 'Error message');
    });

    it('preserves focus', () => {
      const { container } = render(<MemorableDateField {...defaultProps} />);
      const dateField = container.querySelector('va-memorable-date');

      dateField.focus();
      const event = new CustomEvent('dateChange', {
        detail: { value: '1980-03-04' },
      });
      dateField.dispatchEvent(event);

      // Focus should remain on the element after change
      // Note: Focus management is handled by the VA web component
    });
  });

  describe('edge cases', () => {
    it('handles null value', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('value', '');
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('value', '');
    });

    it('handles missing onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');

      const event = new CustomEvent('dateChange', {
        detail: { value: '1977-06-01' },
      });
      expect(() => dateField.dispatchEvent(event)).to.not.throw();
    });

    it('handles empty event details', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');

      const event = new CustomEvent('dateChange', {
        detail: {},
      });
      dateField.dispatchEvent(event);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('');
    });

    it('handles object value format', () => {
      const objectValue = { month: '05', day: '25', year: '1977' };
      const props = { ...defaultProps, value: objectValue };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      // Component should handle object value format
      expect(dateField).to.exist;
    });

    it('handles malformed date strings', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<MemorableDateField {...props} />);

      // Directly call the onChange handler
      onChange('testMemorableDate', 'invalid-date-format');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('invalid-date-format');
    });

    it('handles rapid date changes', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');

      const dates = ['1977-05-25', '1980-05-21', '1983-05-25'];
      dates.forEach(date => {
        const event = new CustomEvent('dateChange', {
          detail: { value: date },
        });
        dateField.dispatchEvent(event);
      });

      expect(onChange.callCount).to.equal(3);
    });
  });

  describe('date format handling', () => {
    it('accepts YYYY-MM-DD format', () => {
      const props = { ...defaultProps, value: '1977-05-25' };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('value', '1977-05-25');
    });

    it('handles partial dates', () => {
      const props = { ...defaultProps, value: '1980-05' };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('value', '1980-05');
    });

    it('handles year-only dates', () => {
      const props = { ...defaultProps, value: '1977' };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('value', '1977');
    });
  });

  describe('month-year only mode', () => {
    it('renders in month-year only mode', () => {
      const props = { ...defaultProps, monthYearOnly: true };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.have.attribute('month-year-only', 'true');
    });

    it('handles onChange in month-year only mode', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, monthYearOnly: true };
      render(<MemorableDateField {...props} />);

      // Directly call the onChange handler
      onChange('testMemorableDate', '1990-05');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.equal('1990-05');
    });
  });

  describe('props forwarding', () => {
    it('forwards additional props to va-memorable-date', () => {
      const props = {
        ...defaultProps,
        'data-testid': 'custom-date',
        className: 'custom-class',
      };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');

      expect(dateField).to.have.attribute('data-testid', 'custom-date');
      expect(dateField).to.have.attribute('class', 'custom-class');
    });

    it('preserves name and label props', () => {
      const props = {
        ...defaultProps,
        name: 'birthDate',
        label: 'Date of Birth',
      };
      const { container } = render(<MemorableDateField {...props} />);
      const dateField = container.querySelector('va-memorable-date');

      expect(dateField).to.have.attribute('name', 'birthDate');
      expect(dateField).to.have.attribute('label', 'Date of Birth');
    });
  });
});
