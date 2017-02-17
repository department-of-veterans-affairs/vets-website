import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import { schema, uiSchema } from '../../../../src/js/common/schemaform/definitions/ssn';

describe.only('Schemaform definition ssn', () => {
  it('should render ssn', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          formData=""/>
    );

    const formDOM = findDOMNode(form);

    const node = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')[0];
    ReactTestUtils.Simulate.change(node, {
      target: {
        value: '123-34'
      }
    });
    ReactTestUtils.Simulate.blur(node);

    expect(formDOM.querySelector('.usa-input-error').textContent).to.equal(uiSchema['ui:errorMessages'].pattern);
  });
});
