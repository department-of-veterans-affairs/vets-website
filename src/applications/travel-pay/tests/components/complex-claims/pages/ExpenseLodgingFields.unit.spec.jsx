import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseLodgingFields from '../../../../components/complex-claims/pages/ExpenseLodgingFields';
import {
  simulateVaDateChange,
  simulateVaInputBlur,
} from '../../../../util/testing-input-helpers';

describe('ExpenseLodgingFields', () => {
  const defaultProps = {
    formState: {
      vendor: '',
      checkInDate: '',
      checkOutDate: '',
    },
    onChange: sinon.spy(),
  };

  it('renders the vendor input', () => {
    const { container } = render(<ExpenseLodgingFields {...defaultProps} />);
    const input = container.querySelector('va-text-input[name="vendor"]');
    expect(input).to.exist;
    expect(input.getAttribute('label')).to.equal('Where did you stay?');
    expect(input.getAttribute('value')).to.equal('');
  });

  it('renders the check-in and check-out date inputs', () => {
    const { container } = render(<ExpenseLodgingFields {...defaultProps} />);
    const checkIn = container.querySelector('va-date[name="checkInDate"]');
    const checkOut = container.querySelector('va-date[name="checkOutDate"]');

    expect(checkIn).to.exist;
    expect(checkIn.getAttribute('label')).to.equal('Check in date');
    expect(checkIn.getAttribute('value')).to.equal('');

    expect(checkOut).to.exist;
    expect(checkOut.getAttribute('label')).to.equal('Check out date');
    expect(checkOut.getAttribute('value')).to.equal('');
  });

  it('renders pre-filled values from formState', () => {
    const preFilled = {
      vendor: 'Marriott',
      checkInDate: '2025-11-10',
      checkOutDate: '2025-11-15',
    };
    const { container } = render(
      <ExpenseLodgingFields
        formState={preFilled}
        onChange={defaultProps.onChange}
      />,
    );

    const vendorInput = container.querySelector('va-text-input[name="vendor"]');
    const checkIn = container.querySelector('va-date[name="checkInDate"]');
    const checkOut = container.querySelector('va-date[name="checkOutDate"]');

    expect(vendorInput.getAttribute('value')).to.equal('Marriott');
    expect(checkIn.getAttribute('value')).to.equal('2025-11-10');
    expect(checkOut.getAttribute('value')).to.equal('2025-11-15');
  });

  it('calls onBlur when focusing out of vendor input', async () => {
    const onBlurSpy = sinon.spy();
    const { container } = render(
      <ExpenseLodgingFields {...defaultProps} onBlur={onBlurSpy} />,
    );

    const vendorInput = container.querySelector('va-text-input[name="vendor"]');
    simulateVaInputBlur(vendorInput, 'Hotel California');

    await waitFor(() => {
      expect(onBlurSpy.called).to.be.true;
      const eventArg = onBlurSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('Hotel California');
    });
  });

  it('calls onChange when changing check-in date', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseLodgingFields {...defaultProps} onChange={onChangeSpy} />,
    );

    const checkIn = container.querySelector('va-date[name="checkInDate"]');
    simulateVaDateChange(checkIn, '2025-11-10');

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const eventArg = onChangeSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('2025-11-10');
    });
  });

  it('calls onChange when changing check-out date', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseLodgingFields {...defaultProps} onChange={onChangeSpy} />,
    );

    const checkOut = container.querySelector('va-date[name="checkOutDate"]');
    simulateVaDateChange(checkOut, '2025-11-15');

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const eventArg = onChangeSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('2025-11-15');
    });
  });

  // --- New tests for error prop ---
  it('renders errors for each field if provided', () => {
    const errorProps = {
      vendor: 'Vendor is required',
      checkInDate: 'Check-in date is required',
      checkOutDate: 'Check-out date is required',
    };
    const { container } = render(
      <ExpenseLodgingFields {...defaultProps} errors={errorProps} />,
    );

    const vendorInput = container.querySelector('va-text-input[name="vendor"]');
    const checkIn = container.querySelector('va-date[name="checkInDate"]');
    const checkOut = container.querySelector('va-date[name="checkOutDate"]');

    expect(vendorInput.getAttribute('error')).to.equal('Vendor is required');
    expect(checkIn.getAttribute('error')).to.equal('Check-in date is required');
    expect(checkOut.getAttribute('error')).to.equal(
      'Check-out date is required',
    );
  });

  it('renders correctly with empty errors object', () => {
    const { container } = render(
      <ExpenseLodgingFields {...defaultProps} errors={{}} />,
    );

    const vendorInput = container.querySelector('va-text-input[name="vendor"]');
    const checkIn = container.querySelector('va-date[name="checkInDate"]');
    const checkOut = container.querySelector('va-date[name="checkOutDate"]');

    expect(vendorInput.getAttribute('error')).to.be.null;
    expect(checkIn.getAttribute('error')).to.be.null;
    expect(checkOut.getAttribute('error')).to.be.null;
  });
});
