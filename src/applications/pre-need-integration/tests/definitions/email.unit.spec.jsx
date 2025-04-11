import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';

import emailUiSchema from '../../definitions/email';

describe('Pre-need Schemaform definition: email', () => {
  it('should render a single email input', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={definitions.email}
        uiSchema={emailUiSchema()}
      />,
    );
    const formDOM = findDOMNode(form);
    const inputs = formDOM.querySelectorAll('input[type="email"]');
    expect(inputs.length).to.equal(1);
  });

  it('should use default title if none is provided', () => {
    const schema = emailUiSchema(); // No title
    expect(schema['ui:title']).to.equal('Email address');
  });

  it('should use custom title if provided', () => {
    const schema = emailUiSchema('Custom Email');
    expect(schema['ui:title']).to.equal('Custom Email');
  });

  it('should include all required error messages', () => {
    const schema = emailUiSchema();
    expect(schema['ui:errorMessages'].format).to.include(
      'Enter a valid email address',
    );
    expect(schema['ui:errorMessages'].pattern).to.include(
      'Enter a valid email address',
    );
    expect(schema['ui:errorMessages'].required).to.include(
      'Please enter an email address',
    );
  });

  it('should have proper inputType and autocomplete options', () => {
    const schema = emailUiSchema();
    expect(schema['ui:options'].inputType).to.equal('email');
    expect(schema['ui:autocomplete']).to.equal('email');
  });
});
