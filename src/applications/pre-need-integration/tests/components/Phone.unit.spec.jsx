import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';
import uiSchema from '../../components/Phone';

describe('Preneed Schemaform definition phone', () => {
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
    const { container } = render(
      <DefinitionTester
        schema={definitions.phone}
        uiSchema={uiSchema()}
        data={{}}
      />,
    );

    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '1asdf' } });
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      const errorElement = container.querySelector('.usa-input-error-message');
      expect(errorElement).to.exist;
    });
  });
});
