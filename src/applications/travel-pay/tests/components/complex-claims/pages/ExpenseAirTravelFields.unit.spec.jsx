import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseAirTravelFields from '../../../../components/complex-claims/pages/ExpenseAirTravelFields';
import { TRIP_TYPES } from '../../../../constants';
import {
  simulateVaDateChange,
  simulateVaInputChange,
  testVaRadioSelection,
} from '../../../../util/testing-input-helpers';

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
      tripType: TRIP_TYPES.ONE_WAY.label,
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
    ).to.equal(TRIP_TYPES.ONE_WAY.label);
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

  it('calls onChange when typing into vendor input', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );
    const vendorInput = container.querySelector(
      'va-text-input[name="vendorName"]',
    );
    simulateVaInputChange(vendorInput, 'United Airlines');

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
    simulateVaDateChange(departureDate, '2025-11-10');

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
    simulateVaDateChange(arrivalDate, '2025-11-11');

    await waitFor(() => {
      const value =
        onChangeSpy.firstCall.args[0]?.detail?.value ||
        onChangeSpy.firstCall.args[0]?.target?.value;
      expect(value).to.equal('2025-11-11');
    });
  });

  it('calls onChange when typing into departure airport input', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );

    const departureAirport = container.querySelector(
      'va-text-input[name="departureAirport"]',
    );
    simulateVaInputChange(departureAirport, 'SFO');

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const eventArg = onChangeSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('SFO');
    });
  });

  it('calls onChange when typing into arrival airport input', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );

    const arrivalAirport = container.querySelector(
      'va-text-input[name="arrivalAirport"]',
    );
    simulateVaInputChange(arrivalAirport, 'ORD');

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const eventArg = onChangeSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('ORD');
    });
  });

  it('checks trip type after selection', () => {
    testVaRadioSelection({
      Component: ExpenseAirTravelFields,
      radioName: 'tripType',
      selectValue: TRIP_TYPES.ROUND_TRIP.label,
      formStateKey: 'tripType',
    });
  });
});
