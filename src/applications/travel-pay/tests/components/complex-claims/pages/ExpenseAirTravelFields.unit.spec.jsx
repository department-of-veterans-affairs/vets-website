import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseAirTravelFields from '../../../../components/complex-claims/pages/ExpenseAirTravelFields';
import { TRIP_OPTIONS } from '../../../../constants';
import {
  simulateVaDateChange,
  simulateVaInputChange,
} from '../../../../util/testing-input-helpers';

// Helper to simulate VA radio selection
// const testVaRadioSelection = ({
//   container,
//   radioName,
//   selectValue,
//   formStateKey,
//   onChangeSpy,
// }) => {
//   const radioGroup = container.querySelector(`va-radio[name="${radioName}"]`);
//   expect(radioGroup).to.exist;

//   fireEvent(
//     radioGroup,
//     new CustomEvent('vaValueChange', {
//       detail: { value: selectValue },
//       bubbles: true,
//       composed: true,
//     }),
//   );

//   // Verify onChange spy was called
//   expect(onChangeSpy.calledOnce).to.be.true;
//   expect(onChangeSpy.firstCall.args[0].value).to.equal(selectValue);
//   expect(onChangeSpy.firstCall.args[1]).to.equal(formStateKey);

//   // Rerender with updated state
//   const updatedState = { [formStateKey]: selectValue };
//   return updatedState;
// };

const testVaRadioSelection = ({ radioName, selectValue, formStateKey }) => {
  const onChangeSpy = sinon.spy();
  const initialState = {
    transportationType: '',
    transportationReason: '',
  };

  const utils = render(
    <ExpenseAirTravelFields formState={initialState} onChange={onChangeSpy} />,
  );

  const radioGroup = utils.container.querySelector(
    `va-radio[name="${radioName}"]`,
  );
  expect(radioGroup).to.exist;

  // Trigger selection
  fireEvent(
    radioGroup,
    new CustomEvent('vaValueChange', {
      detail: { value: selectValue },
      bubbles: true,
      composed: true,
    }),
  );

  // Spy assertions
  expect(onChangeSpy.calledOnce).to.be.true;
  expect(onChangeSpy.firstCall.args[0].value).to.equal(selectValue);
  expect(onChangeSpy.firstCall.args[1]).to.equal(formStateKey);

  // Rerender with updated state
  const updatedState = {
    ...initialState,
    [formStateKey]: selectValue,
  };

  utils.rerender(
    <ExpenseAirTravelFields formState={updatedState} onChange={onChangeSpy} />,
  );

  // Assert that the selected option is checked
  const option = utils.container.querySelector(
    `va-radio-option[value="${selectValue}"]`,
  );
  expect(option).to.exist;
  expect(option.getAttribute('checked')).to.equal('true');
};

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
        onChangeSpy.firstCall.args[0]?.detail ||
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
        onChangeSpy.firstCall.args[0]?.detail ||
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
        onChangeSpy.firstCall.args[0]?.detail ||
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
      const value = eventArg?.detail || eventArg?.target?.value;
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
      const value = eventArg?.detail || eventArg?.target?.value;
      expect(value).to.equal('ORD');
    });
  });

  it('checks trip type after selection', () => {
    testVaRadioSelection({
      radioName: 'tripType',
      selectValue: TRIP_OPTIONS[0],
      formStateKey: 'tripType',
    });
  });
});
