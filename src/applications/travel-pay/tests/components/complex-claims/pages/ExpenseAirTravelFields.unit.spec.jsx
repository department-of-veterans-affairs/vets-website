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
      departedFrom: '',
      returnDate: '',
      arrivedTo: '',
    },
    onChange: sinon.spy(),
  };

  it('renders all inputs with empty values', () => {
    const { container } = render(<ExpenseAirTravelFields {...defaultProps} />);

    const returnDate = container.querySelector('va-date[name="returnDate"]');
    expect(returnDate).to.exist;
    // Check that required is false initially because tripType is empty
    expect(returnDate.required).to.be.false;
  });

  it('renders pre-filled values', () => {
    const preFilled = {
      vendorName: 'Delta',
      tripType: TRIP_TYPES.ONE_WAY.value,
      departureDate: '2025-11-10',
      departedFrom: 'JFK',
      returnDate: '2025-11-11',
      arrivedTo: 'LAX',
    };

    const { container } = render(
      <ExpenseAirTravelFields
        formState={preFilled}
        onChange={defaultProps.onChange}
      />,
    );

    expect(
      container
        .querySelector('va-radio[name="tripType"]')
        .getAttribute('value'),
    ).to.equal(TRIP_TYPES.ONE_WAY.value);

    const returnDate = container.querySelector('va-date[name="returnDate"]');
    expect(returnDate.required).to.be.false; // ONE_WAY, so returnDate not required
  });

  it('makes returnDate required when tripType is ROUND_TRIP', () => {
    const roundTripProps = {
      ...defaultProps,
      formState: {
        ...defaultProps.formState,
        tripType: TRIP_TYPES.ROUND_TRIP.value,
      },
    };
    const { container } = render(
      <ExpenseAirTravelFields {...roundTripProps} />,
    );
    const returnDate = container.querySelector('va-date[name="returnDate"]');
    expect(returnDate.required).to.be.true;
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

  it('calls onChange when changing return date', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );
    const returnDate = container.querySelector('va-date[name="returnDate"]');
    simulateVaDateChange(returnDate, '2025-11-11');

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
    const departedFrom = container.querySelector(
      'va-text-input[name="departedFrom"]',
    );
    simulateVaInputChange(departedFrom, 'SFO');

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const value =
        onChangeSpy.firstCall.args[0]?.detail?.value ||
        onChangeSpy.firstCall.args[0]?.target?.value;
      expect(value).to.equal('SFO');
    });
  });

  it('calls onChange when typing into arrival airport input', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseAirTravelFields {...defaultProps} onChange={onChangeSpy} />,
    );
    const arrivedTo = container.querySelector(
      'va-text-input[name="arrivedTo"]',
    );
    simulateVaInputChange(arrivedTo, 'ORD');

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const value =
        onChangeSpy.firstCall.args[0]?.detail?.value ||
        onChangeSpy.firstCall.args[0]?.target?.value;
      expect(value).to.equal('ORD');
    });
  });

  it('checks trip type after selection', () => {
    testVaRadioSelection({
      Component: ExpenseAirTravelFields,
      radioName: 'tripType',
      selectValue: TRIP_TYPES.ROUND_TRIP.value,
      formStateKey: 'tripType',
    });
  });
});
