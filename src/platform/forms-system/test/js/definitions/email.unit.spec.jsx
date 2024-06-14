import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';
import uiSchema from '../../../src/js/definitions/email';

describe('Schemaform definition email', () => {
  it('should render email', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={definitions.email} uiSchema={uiSchema()} />,
    );
    const formDOM = findDOMNode(form);
    const input = formDOM.querySelector('input');
    expect(input).to.have.attr('type', 'email');
    expect(input).have.attr('maxLength', `${definitions.email.maxLength}`);
  });

  it('should render invalid email error', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={definitions.email} uiSchema={uiSchema()} />,
    );
    const formDOM = findDOMNode(form);
    const input = formDOM.querySelector('input');

    expect(
      formDOM.querySelectorAll('.usa-input-error-message'),
    ).to.have.lengthOf(0);

    ReactTestUtils.Simulate.change(input, {
      target: {
        value: 'as@dc',
      },
    });
    ReactTestUtils.Simulate.blur(input);

    expect(
      formDOM.querySelector('.usa-input-error-message').textContent,
    ).to.equal(`Error ${uiSchema()['ui:errorMessages'].format}`);
  });

  it('should render email title', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={definitions.email}
        uiSchema={uiSchema('My email')}
      />,
    );
    const formDOM = findDOMNode(form);
    expect(formDOM.querySelector('label').textContent).to.equal('My email');
  });

  it('should render email for review', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        reviewMode
        schema={definitions.ssn}
        uiSchema={uiSchema()}
        data="email@domain.com"
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelector('dd').textContent).to.equal(
      'email@domain.com',
    );
  });
});
