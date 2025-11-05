import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseCommonCarrierFields from '../../../../components/complex-claims/pages/ExpenseCommonCarrierFields';
import {
  TRANSPORTATION_OPTIONS,
  TRANSPORTATION_REASONS,
} from '../../../../constants';

// Helper to simulate VA radio selection
const testVaRadioSelection = ({ radioName, selectValue, formStateKey }) => {
  const onChangeSpy = sinon.spy();
  const initialState = {
    transportationType: '',
    transportationReason: '',
  };

  const utils = render(
    <ExpenseCommonCarrierFields
      formState={initialState}
      onChange={onChangeSpy}
    />,
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
    <ExpenseCommonCarrierFields
      formState={updatedState}
      onChange={onChangeSpy}
    />,
  );

  // Assert that the selected option is checked
  const option = utils.container.querySelector(
    `va-radio-option[value="${selectValue}"]`,
  );
  expect(option).to.exist;
  expect(option.getAttribute('checked')).to.equal('true');
};

describe('ExpenseCommonCarrierFields', () => {
  const defaultProps = {
    formState: {
      transportationType: '',
      transportationReason: '',
    },
    onChange: sinon.spy(),
  };

  it('renders transportation type radio group with options', () => {
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} />,
    );

    const radio = container.querySelector(
      'va-radio[name="transportationType"]',
    );
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal('Type of transportation');
    expect(radio.getAttribute('value')).to.equal('');

    TRANSPORTATION_OPTIONS.forEach(option => {
      const radioOption = container.querySelector(
        `va-radio-option[label="${option}"]`,
      );
      expect(radioOption).to.exist;
      expect(radioOption.getAttribute('checked')).to.equal('false');
    });
  });

  it('renders transportation reason radio group with options', () => {
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} />,
    );

    const radio = container.querySelector(
      'va-radio[name="transportationReason"]',
    );
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Why did you choose to use public transportation?',
    );
    expect(radio.getAttribute('value')).to.equal('');

    Object.keys(TRANSPORTATION_REASONS).forEach(key => {
      const radioOption = container.querySelector(
        `va-radio-option[label="${TRANSPORTATION_REASONS[key].label}"]`,
      );
      expect(radioOption).to.exist;
      expect(radioOption.getAttribute('checked')).to.equal('false');
    });
  });

  it('marks the correct transportationType as checked', () => {
    const formState = {
      transportationType: TRANSPORTATION_OPTIONS[1],
      transportationReason: '',
    };
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} formState={formState} />,
    );

    TRANSPORTATION_OPTIONS.forEach(option => {
      const radioOption = container.querySelector(
        `va-radio-option[label="${option}"]`,
      );
      const expected = option === TRANSPORTATION_OPTIONS[1] ? 'true' : 'false';
      expect(radioOption.getAttribute('checked')).to.equal(expected);
    });
  });

  it('marks the correct transportationReason as checked', () => {
    const firstKey = Object.keys(TRANSPORTATION_REASONS)[0];
    const formState = {
      transportationType: '',
      transportationReason: firstKey,
    };
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} formState={formState} />,
    );

    Object.keys(TRANSPORTATION_REASONS).forEach(key => {
      const radioOption = container.querySelector(
        `va-radio-option[label="${TRANSPORTATION_REASONS[key].label}"]`,
      );
      const expected = key === firstKey ? 'true' : 'false';
      expect(radioOption.getAttribute('checked')).to.equal(expected);
    });
  });

  it('checks the transportation type after selection', () => {
    testVaRadioSelection({
      radioName: 'transportationType',
      selectValue: TRANSPORTATION_OPTIONS[0],
      formStateKey: 'transportationType',
    });
  });

  it('checks the transportation reason after selection', () => {
    const firstKey = Object.keys(TRANSPORTATION_REASONS)[0];
    testVaRadioSelection({
      radioName: 'transportationReason',
      selectValue: firstKey,
      formStateKey: 'transportationReason',
    });
  });
});
