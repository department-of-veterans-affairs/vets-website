import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';
import uiSchema from '../../../src/js/definitions/date';

describe('Schemaform definition date', () => {
  it('should render date', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={definitions.date} uiSchema={uiSchema()} />,
    );

    const formDOM = findDOMNode(form);

    const input = formDOM.querySelector('input');
    expect(input.type).to.equal('number');
    const selects = formDOM.querySelectorAll('select');
    expect(selects.length).to.equal(2);
  });
  it('should render invalid date error', () => {
    const dateUISchema = uiSchema();
    const form = render(
      <DefinitionTester schema={definitions.date} uiSchema={dateUISchema} />,
    );

    const input = form.getByLabelText('Year');
    // normal method of setting input will not work if the value is not a number
    Object.defineProperty(input, 'value', { value: 'asdf', writable: true }); // Directly set value
    fireEvent.input(input);

    const mouseClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    const submitButton = form.getByRole('button', { name: 'Submit' });
    fireEvent(submitButton, mouseClick);
    waitFor(() => {
      const error = form.container.querySelector('.usa-input-error-message');
      expect(error.textContent).to.equal(
        `Error ${dateUISchema['ui:errorMessages'].pattern}`,
      );
    });
  });
  it('should render date title', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={definitions.date}
        uiSchema={uiSchema('My date')}
      />,
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelector('legend').textContent).to.equal('My date');
  });
});
