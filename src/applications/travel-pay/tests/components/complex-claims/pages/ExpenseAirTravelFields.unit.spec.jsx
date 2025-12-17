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

    const vendorInput = container.querySelector(
      'va-text-input[name="vendorName"]',
    );
    expect(vendorInput).to.exist;
    expect(vendorInput.getAttribute('label')).to.equal(
      'Where did you purchase your ticket?',
    );
    expect(vendorInput.getAttribute('value')).to.equal('');
    expect(vendorInput.getAttribute('hint')).to.equal(
      `Enter the company you purchased the ticket from, even if it isn't an airline.`,
    );

    const tripRadio = container.querySelector('va-radio[name="tripType"]');
    expect(tripRadio).to.exist;
    expect(tripRadio.getAttribute('value')).to.equal('');

    const departureDate = container.querySelector(
      'va-date[name="departureDate"]',
    );
    expect(departureDate).to.exist;
    expect(departureDate.getAttribute('value')).to.equal('');
    expect(departureDate.getAttribute('hint')).to.equal(
      `Enter the date on your departure ticket.`,
    );

    const departedFrom = container.querySelector(
      'va-text-input[name="departedFrom"]',
    );
    expect(departedFrom).to.exist;
    expect(departedFrom.getAttribute('value')).to.equal('');

    const returnDate = container.querySelector('va-date[name="returnDate"]');
    expect(returnDate).to.exist;
    expect(returnDate.getAttribute('value')).to.equal('');
    expect(returnDate.getAttribute('hint')).to.equal(
      `Enter the date on your return ticket. For one-way trips, leave this blank.`,
    );

    const arrivedTo = container.querySelector(
      'va-text-input[name="arrivedTo"]',
    );
    expect(arrivedTo).to.exist;
    expect(arrivedTo.getAttribute('value')).to.equal('');
  });

  it('renders pre-filled values', () => {
    const preFilled = {
      vendorName: 'Delta',
      tripType: TRIP_TYPES.ONE_WAY.label,
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
        .querySelector('va-text-input[name="departedFrom"]')
        .getAttribute('value'),
    ).to.equal('JFK');
    expect(
      container
        .querySelector('va-date[name="returnDate"]')
        .getAttribute('value'),
    ).to.equal('2025-11-11');
    expect(
      container
        .querySelector('va-text-input[name="arrivedTo"]')
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

    const arrivedTo = container.querySelector(
      'va-text-input[name="arrivedTo"]',
    );
    simulateVaInputChange(arrivedTo, 'ORD');

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
