import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';
import uiSchema from '../../../src/js/definitions/bankAccount';

describe('Schemaform definition bankAccount', () => {
  it('should render bankAccount', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={definitions.bankAccount} uiSchema={uiSchema} />,
    );

    const formDOM = findDOMNode(form);

    const inputs = Array.from(formDOM.querySelectorAll('input'));

    expect(inputs[0].id).to.equal('root_accountType_0');
    expect(inputs[1].id).to.equal('root_accountType_1');
    expect(inputs[0].type).to.equal('radio');
    expect(inputs[1].type).to.equal('radio');
    expect(inputs[2].id).to.equal('root_accountNumber');
    expect(inputs[3].id).to.equal('root_routingNumber');
  });
  it('should render bankAccount with routing number error', async () => {
    const form = render(
      <DefinitionTester schema={definitions.bankAccount} uiSchema={uiSchema} />,
    );

    const input = form.container.querySelector('#root_routingNumber');
    fireEvent.change(input, { target: { value: '123456789' } });
    const submitButton = form.getByRole('button', { name: 'Submit' });

    const mouseClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    fireEvent(submitButton, mouseClick);
    await waitFor(() => {
      const error = form.container.querySelector('.usa-input-error-message');
      expect(error.textContent).to.equal(
        `Error ${uiSchema.routingNumber['ui:errorMessages'].pattern}`,
      );
    });
  });
});
