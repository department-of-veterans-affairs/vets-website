import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseAirTravelFields from '../../../../components/complex-claims/pages/ExpenseAirTravelFields';
import { TRIP_OPTIONS } from '../../../../constants';

describe('ExpenseAirTravelFields', () => {
  const defaultProps = {
    formState: {
      vendorName: '',
      tripType: '',
      departureDate: '',
      departureAirport: '',
      arrivalDate: '',
      arrivalAirport: '',
    },
    onChange: sinon.spy(),
  };

  it('renders all inputs with empty values', () => {
    const { container } = render(<ExpenseAirTravelFields {...defaultProps} />);

    const vendorInput = container.querySelector(
      'va-text-input[name="vendorName"]',
    );
    expect(vendorInput).to.exist;
    expect(vendorInput.getAttribute('label')).to.equal(
      'Where did you purchase your ticket?',
    );
    expect(vendorInput.getAttribute('value')).to.equal('');

    const tripRadio = container.querySelector('va-radio[name="tripType"]');
    expect(tripRadio).to.exist;
    expect(tripRadio.getAttribute('value')).to.equal('');

    const departureDate = container.querySelector(
      'va-date[name="departureDate"]',
    );
    expect(departureDate).to.exist;
    expect(departureDate.getAttribute('value')).to.equal('');

    const departureAirport = container.querySelector(
      'va-text-input[name="departureAirport"]',
    );
    expect(departureAirport).to.exist;
    expect(departureAirport.getAttribute('value')).to.equal('');

    const arrivalDate = container.querySelector('va-date[name="arrivalDate"]');
    expect(arrivalDate).to.exist;
    expect(arrivalDate.getAttribute('value')).to.equal('');

    const arrivalAirport = container.querySelector(
      'va-text-input[name="arrivalAirport"]',
    );
    expect(arrivalAirport).to.exist;
    expect(arrivalAirport.getAttribute('value')).to.equal('');
  });

  it('renders pre-filled values', () => {
    const preFilled = {
      vendorName: 'Delta',
      tripType: TRIP_OPTIONS[1],
      departureDate: '2025-11-10',
      departureAirport: 'JFK',
      arrivalDate: '2025-11-11',
      arrivalAirport: 'LAX',
    };

    const { container } = render(
      <ExpenseAirTravelFields
        formState={preFilled}
        onChange={defaultProps.onChange}
      />,
    );

    expect(
      container
        .querySelector('va-text-input[name="vendorName"]')
        .getAttribute('value'),
    ).to.equal('Delta');
    expect(
      container
        .querySelector('va-radio[name="tripType"]')
        .getAttribute('value'),
    ).to.equal(TRIP_OPTIONS[1]);
    expect(
      container
        .querySelector('va-date[name="departureDate"]')
        .getAttribute('value'),
    ).to.equal('2025-11-10');
    expect(
      container
        .querySelector('va-text-input[name="departureAirport"]')
        .getAttribute('value'),
    ).to.equal('JFK');
    expect(
      container
        .querySelector('va-date[name="arrivalDate"]')
        .getAttribute('value'),
    ).to.equal('2025-11-11');
    expect(
      container
        .querySelector('va-text-input[name="arrivalAirport"]')
        .getAttribute('value'),
    ).to.equal('LAX');
  });

  // Updated to use direct event dispatching - testing if Node 22 compatibility issue is resolved
  it('calls onChange when typing into vendor input', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );
    const vendorInput = container.querySelector(
      'va-text-input[name="vendorName"]',
    );
    // Simulate the input change using direct event dispatching
    vendorInput.value = 'United Airlines';
    vendorInput.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: 'United Airlines' },
        bubbles: true,
        composed: true,
      }),
    );

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const value =
        onChangeSpy.firstCall.args[0]?.detail?.value ||
        onChangeSpy.firstCall.args[0]?.target?.value;
      expect(value).to.equal('United Airlines');
    });
  });

  it('calls onChange when changing departure date', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );
    const departureDate = container.querySelector(
      'va-date[name="departureDate"]',
    );
    departureDate.value = '2025-11-10';
    departureDate.dispatchEvent(
      new CustomEvent('dateChange', {
        detail: { value: '2025-11-10' },
        bubbles: true,
        composed: true,
      }),
    );

    await waitFor(() => {
      const value =
        onChangeSpy.firstCall.args[0]?.detail?.value ||
        onChangeSpy.firstCall.args[0]?.target?.value;
      expect(value).to.equal('2025-11-10');
    });
  });

  it('calls onChange when changing arrival date', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );
    const arrivalDate = container.querySelector('va-date[name="arrivalDate"]');
    arrivalDate.value = '2025-11-11';
    arrivalDate.dispatchEvent(
      new CustomEvent('dateChange', {
        detail: { value: '2025-11-11' },
        bubbles: true,
        composed: true,
      }),
    );

    await waitFor(() => {
      const value =
        onChangeSpy.firstCall.args[0]?.detail?.value ||
        onChangeSpy.firstCall.args[0]?.target?.value;
      expect(value).to.equal('2025-11-11');
    });
  });

  // Updated to use direct event dispatching - testing if Node 22 compatibility issue is resolved
  it('calls onChange when typing into departure airport input', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );

    const departureAirport = container.querySelector(
      'va-text-input[name="departureAirport"]',
    );
    departureAirport.value = 'SFO';
    departureAirport.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: 'SFO' },
        bubbles: true,
        composed: true,
      }),
    );

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const eventArg = onChangeSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('SFO');
    });
  });

  // Updated to use direct event dispatching - testing if Node 22 compatibility issue is resolved
  it('calls onChange when typing into arrival airport input', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );

    const arrivalAirport = container.querySelector(
      'va-text-input[name="arrivalAirport"]',
    );
    arrivalAirport.value = 'ORD';
    arrivalAirport.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: 'ORD' },
        bubbles: true,
        composed: true,
      }),
    );

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const eventArg = onChangeSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('ORD');
    });
  });

  it('checks trip type after selection', () => {
    const onChangeSpy = sinon.spy();
    const { container, rerender } = render(
      <ExpenseAirTravelFields
        {...defaultProps}
        formState={{}}
        onChange={onChangeSpy}
      />,
    );

    // Find the radio group
    const radioGroup = container.querySelector('va-radio[name="tripType"]');
    expect(radioGroup).to.exist;

    // Trigger value selection using direct event dispatching
    radioGroup.dispatchEvent(
      new CustomEvent('vaValueChange', {
        detail: { value: TRIP_OPTIONS[0] },
        bubbles: true,
        composed: true,
      }),
    );

    // Assert spy was called correctly
    expect(onChangeSpy.calledOnce).to.be.true;
    expect(onChangeSpy.firstCall.args[0].value).to.equal(TRIP_OPTIONS[0]);
    expect(onChangeSpy.firstCall.args[1]).to.equal('tripType');

    // Update state and rerender
    const updatedState = { tripType: TRIP_OPTIONS[0] };
    rerender(
      <ExpenseAirTravelFields
        {...defaultProps}
        formState={updatedState}
        onChange={onChangeSpy}
      />,
    );

    // Assert that the option is checked
    const selectedOption = container.querySelector(
      `va-radio-option[value="${TRIP_OPTIONS[0]}"]`,
    );
    expect(selectedOption).to.exist;
    expect(selectedOption.getAttribute('checked')).to.equal('true');
  });
});
