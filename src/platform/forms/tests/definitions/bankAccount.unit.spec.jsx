import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import definitions from 'vets-json-schema/dist/definitions.json';
import { DefinitionTester } from '../../../testing/unit/schemaform-utils.jsx';
import uiSchema from '../../definitions/bankAccount';

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
  it('should render bankAccount with routing number error', () => {
    const form = render(
      <DefinitionTester schema={definitions.bankAccount} uiSchema={uiSchema} />,
    );

    const routingNumberInput = form.container.querySelector(
      '#root_routingNumber',
    );
    fireEvent.change(routingNumberInput, { target: { value: '123456789' } });

    waitFor(() => {
      screen.getByText(
        `Error ${uiSchema.routingNumber['ui:errorMessages'].pattern}`,
      );
    });
  });
});
