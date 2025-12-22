import React from 'react';

import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';

/**
 * Simulates a VA text input change event using direct event dispatching.
 * @param {HTMLElement} inputField - The VA text input field element.
 * @param {string|number} value - The value to set for the input field.
 * @returns {{field: HTMLElement, value: string|number, eventFired: boolean}|null}
 *          An object containing the updated field, value, and confirmation that events were fired,
 *          or null if the inputField is not provided.
 */
export function simulateVaInputChange(inputField, value) {
  if (!inputField) return null;

  // Set the value and dispatch the input event directly
  const field = inputField;
  field.value = value;

  const inputEvent = new window.InputEvent('input', {
    bubbles: true,
    composed: true,
    data: value,
  });
  field.dispatchEvent(inputEvent);

  return { field, value, eventFired: true };
}

/**
 * Simulates a VA text input blur event by updating the value and
 * dispatching a bubbling FocusEvent for focusout.
 * @param {HTMLElement} inputField - The <va-text-input> element.
 * @param {string|number} value - The value to set.
 */
export function simulateVaInputBlur(inputField, value) {
  if (!inputField) return null;

  // Set the value and dispatch the input event directly
  const field = inputField;
  field.value = value;

  const blurEvent = new window.FocusEvent('focusout', {
    bubbles: true,
    composed: true,
  });

  inputField.dispatchEvent(blurEvent);

  return { field: inputField, value, eventFired: true };
}

/**
 * Simulates a VA date input change event using direct event dispatching.
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

  // Dispatch the dateChange event that VA date components use
  fireEvent(
    field,
    new CustomEvent('dateChange', {
      detail: { value },
      bubbles: true,
      composed: true,
    }),
  );

  return { field, value, eventFired: true };
}

/**
 * Helper to simulate selecting a value in a VA radio group and using direct event dispatching.
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

  // Trigger value selection using direct event dispatching.
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

  // Query all radio-option children inside the group
  const radioOptions = radioGroup.querySelectorAll('va-radio-option');
  expect(radioOptions.length).to.be.greaterThan(0);

  // Find the selected option by matching its value or label
  const selectedOption = Array.from(radioOptions).find(
    option =>
      option.getAttribute('value') === selectValue ||
      option.getAttribute('label') === selectValue,
  );
  expect(selectedOption).to.exist;

  // Assert that the option is checked
  expect(selectedOption.hasAttribute('checked')).to.be.true;

  return { utils, onChangeSpy, updatedState, selectedOption };
};
