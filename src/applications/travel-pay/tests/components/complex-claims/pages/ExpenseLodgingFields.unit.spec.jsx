import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseLodgingFields from '../../../../components/complex-claims/pages/ExpenseLodgingFields';

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

  // Updated to use direct event dispatching - testing if Node 22 compatibility issue is resolved
  it('calls onChange when typing into vendor input', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseLodgingFields {...defaultProps} onChange={onChangeSpy} />,
    );

    const vendorInput = container.querySelector('va-text-input[name="vendor"]');
    vendorInput.value = 'Hotel California';
    fireEvent(
      vendorInput,
      new CustomEvent('input', {
        detail: { value: 'Hotel California' },
        bubbles: true,
        composed: true,
      }),
    );

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const eventArg = onChangeSpy.firstCall.args[0];
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
    checkIn.value = '2025-11-10';
    fireEvent(
      checkIn,
      new CustomEvent('dateChange', {
        detail: { value: '2025-11-10' },
        bubbles: true,
        composed: true,
      }),
    );

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
    checkOut.value = '2025-11-15';
    fireEvent(
      checkOut,
      new CustomEvent('dateChange', {
        detail: { value: '2025-11-15' },
        bubbles: true,
        composed: true,
      }),
    );

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const eventArg = onChangeSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('2025-11-15');
    });
  });
});
