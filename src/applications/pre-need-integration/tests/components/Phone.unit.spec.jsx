import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import Form from '@department-of-veterans-affairs/react-jsonschema-form';

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
  it('should render minLength phone error', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={definitions.phone} uiSchema={uiSchema()} />,
    );

    const formDOM = findDOMNode(form);
    ReactTestUtils.Simulate.change(formDOM.querySelector('input'), {
      target: {
        value: '1asdf',
      },
    });
    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f,
    });

    expect(
      formDOM.querySelector('.usa-input-error-message').textContent,
    ).to.include('Phone number should be between 10-15 digits long');
  });
});
