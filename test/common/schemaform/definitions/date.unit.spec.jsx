import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';
import Form from 'react-jsonschema-form';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import { schema, uiSchema } from '../../../../src/js/common/schemaform/definitions/date';

describe('Schemaform definition date', () => {
  it('should render date', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema()}/>
    );

    const formDOM = findDOMNode(form);

    const input = formDOM.querySelector('input');
    expect(input.type).to.equal('number');
    const selects = formDOM.querySelectorAll('select');
    expect(selects.length).to.equal(2);
  });
  it('should render invalid date error', () => {
    const dateUISchema = uiSchema();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={dateUISchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);
    ReactTestUtils.Simulate.change(find('input'), {
      target: {
        value: 'asfd'
      }
    });
    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });

    expect(find('.usa-input-error-message').textContent).to.equal(dateUISchema['ui:errorMessages'].pattern);
  });
  it('should render date title', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema('My date')}/>
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelector('label').textContent).to.equal('My date');
  });
});
