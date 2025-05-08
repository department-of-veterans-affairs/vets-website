import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

// simulate v1 forms library input change
export const simulateInputChange = (formDOM, querySelectorElement, value) => {
  return ReactTestUtils.Simulate.change(
    formDOM.querySelector(querySelectorElement),
    {
      target: {
        value,
      },
    },
  );
};

// trigger vaTextInput event
export const inputVaTextInput = (selector, value) => {
  const vaTextInput = selector;
  vaTextInput.value = value;
  const event = new CustomEvent('input', {
    bubbles: true,
    detail: { value },
  });
  vaTextInput.dispatchEvent(event);
};

/*
Check to ensure that the address state field is required for non-US countries. It
must be present in order to pass Enrollment System validation.
 */
export const expectStateInputToBeRequired = (
  schema,
  uiSchema,
  definitions,
  countryFieldName,
  stateFieldName,
) => {
  const { container } = render(
    <DefinitionTester
      schema={schema}
      uiSchema={uiSchema}
      definitions={definitions}
    />,
  );

  const country = container.querySelector(`[name="root_${countryFieldName}"]`);
  const state = container.querySelector(`[name="root_${stateFieldName}"]`);

  country.__events.vaSelect({
    target: {
      name: `root_${countryFieldName}`,
      value: 'CAN',
    },
  });

  expect(state).to.have.attr('required', 'true');
};
