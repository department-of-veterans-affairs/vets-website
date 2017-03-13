import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';
import Form from 'react-jsonschema-form';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import { schema, uiSchema } from '../../../../src/js/common/schemaform/definitions/bankAccount';

describe('Schemaform definition bankAccount', () => {
  it('should render bankAccount', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}/>
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
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);
    ReactTestUtils.Simulate.change(find('#root_routingNumber'), {
      target: {
        value: '123456789'
      }
    });

    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });
    expect(find('.usa-input-error-message').textContent).to.equal(uiSchema.routingNumber['ui:errorMessages'].pattern);
  });
});
