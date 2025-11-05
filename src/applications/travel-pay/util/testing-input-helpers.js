import React from 'react';

import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';

/**
 * Simulates a VA text input change event and optionally calls the onInput handler.
 * @param {HTMLElement} inputField - The VA text input field element.
 * @param {string|number} value - The value to set for the input field.
 * @returns {{field: HTMLElement, value: string|number, eventFired: boolean}|null}
 *          An object containing the updated field, value, and confirmation that events were fired,
 *          or null if the inputField is not provided.
 */
export function simulateVaInputChange(inputField, value) {
  if (!inputField) return null;

  // Update the custom element's value property
  const field = inputField;
  field.value = value;

  // Call the internal onInput prop if it exists
  if (typeof field.onInput === 'function') {
    field.onInput({ target: { value } });
  }

  // Fire a synthetic input event to match user behavior
  const event = new Event('input', {
    bubbles: true,
    composed: true,
  });

  field.dispatchEvent(event);

  return { field, value, eventFired: true };
}

/**
 * Simulates a VA date input change event and optionally calls the onDateChange handler.
 * @param {HTMLElement} dateField - The VA date input field element.
 * @param {string|Date} value - The date value to set for the field.
 * @returns {{field: HTMLElement, value: string|Date, eventFired: boolean}|null}
 *          An object containing the updated field, value, and confirmation that events were fired,
 *          or null if the dateField is not provided.
 */
export function simulateVaDateChange(dateField, value) {
  if (!dateField) return null;

  const field = dateField;
  field.value = value;

  // Dispatch standard VA date events
  field.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  field.dispatchEvent(
    new CustomEvent('dateChange', {
      detail: value,
      bubbles: true,
      composed: true,
    }),
  );

  // Call the component's onDateChange handler if it exists
  if (typeof field.onDateChange === 'function') {
    field.onDateChange({ target: { value } }, value);
  }

  return { field, value, eventFired: true };
}

/**
 * Helper to simulate selecting a value in a VA radio group and verifying state updates.
 * Works for any VA-style radio component.
 *
 * @param {Object} params
 * @param {React.ComponentType} params.Component - The React component to render (e.g., ExpenseCommonCarrierFields or ExpenseAirTravelFields)
 * @param {Object} [params.componentProps={}] - Any additional props to pass to the component
 * @param {string} params.radioName - The name of the va-radio component
 * @param {string} params.selectValue - The value to select in the radio group
 * @param {string} params.formStateKey - The key in the form state to update
 * @param {Object} [params.initialState={}] - Optional initial state for the form
 * @returns {Object} - Returns the render utils, spy, updated state, and selected option element
 */
/* eslint-disable no-unused-expressions */
export const testVaRadioSelection = ({
  Component,
  componentProps = {},
  radioName,
  selectValue,
  formStateKey,
  initialState = {},
}) => {
  const onChangeSpy = sinon.spy();

  // Render the component
  const utils = render(
    <Component
      {...componentProps}
      formState={initialState}
      onChange={onChangeSpy}
    />,
  );

  // Find the radio group
  const radioGroup = utils.container.querySelector(
    `va-radio[name="${radioName}"]`,
  );
  expect(radioGroup).to.exist;

  // Trigger value selection
  fireEvent(
    radioGroup,
    new CustomEvent('vaValueChange', {
      detail: { value: selectValue },
      bubbles: true,
      composed: true,
    }),
  );

  // Assert spy was called correctly
  expect(onChangeSpy.calledOnce).to.be.true;
  expect(onChangeSpy.firstCall.args[0].value).to.equal(selectValue);
  expect(onChangeSpy.firstCall.args[1]).to.equal(formStateKey);

  // Update state and rerender
  const updatedState = {
    ...initialState,
    [formStateKey]: selectValue,
  };

  utils.rerender(
    <Component
      {...componentProps}
      formState={updatedState}
      onChange={onChangeSpy}
    />,
  );

  // Assert that the option is checked
  const selectedOption = utils.container.querySelector(
    `va-radio-option[value="${selectValue}"]`,
  );
  expect(selectedOption).to.exist;
  expect(selectedOption.getAttribute('checked')).to.equal('true');

  return { utils, onChangeSpy, updatedState, selectedOption };
};
