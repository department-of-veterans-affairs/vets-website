import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';
import uiSchema from '../../../src/js/definitions/phone';

describe('Schemaform definition phone', () => {
  it('should render phone', () => {
    const phoneUiSchema = uiSchema();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={definitions.phone} uiSchema={phoneUiSchema} />,
    );

    const formDOM = findDOMNode(form);

    const input = formDOM.querySelector('input');
    const phoneClasses = phoneUiSchema['ui:options'].widgetClassNames.split(
      ' ',
    );
    phoneClasses.forEach(className => {
      expect(input.classList.contains(className)).to.be.true;
    });
    expect(input.type).to.equal('tel');
    expect(input.autocomplete).to.equal('tel');
  });
  it('should render phone title', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={definitions.phone}
        uiSchema={uiSchema('My phone')}
      />,
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelector('label').textContent).to.equal('My phone');
  });
  it('should render minLength phone error', async () => {
    const form = render(
      <DefinitionTester schema={definitions.phone} uiSchema={uiSchema()} />,
    );

    const input = form.container.querySelector('input');
    fireEvent.change(input, { target: { value: '1asdf' } });

    const submitButton = form.getByRole('button', { name: 'Submit' });
    const mouseClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    fireEvent(submitButton, mouseClick);

    await waitFor(() => {
      screen.getByText(
        'Please enter a 10-digit phone number (with or without dashes)',
      );
    });
  });
});
