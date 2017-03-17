import _ from 'lodash/fp';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import * as formConfig from '../../../src/js/edu-benefits/definitions/veteranId';
import definitions from 'vets-json-schema/dist/definitions.json';

describe('Edu veteranId', () => {
  const { schema, uiSchema } = formConfig;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          definitions={_.merge(definitions, formConfig.defaultDefinitions)}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    const inputs = Array.from(formDOM.querySelectorAll('input, select'));

    expect(inputs.length).to.equal(2);
  });

  it('should conditionally require file number', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    submitForm(form);

    // error shown for empty ssn input; file number input is not visible
    expect(formDOM.querySelector('.usa-input-error #root_veteranSocialSecurityNumber')).not.to.be.null;
    expect(formDOM.querySelector('#root_vaFileNumber')).to.be.null;
    const noSSNBox = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')
      .find(input => input.getAttribute('name') === 'root_view:noSSN');

    ReactTestUtils.Simulate.change(noSSNBox,
      {
        target: {
          checked: true
        }
      });

    // no error shown for empty ssn input; error shown for empty VA file number input
    expect(formDOM.querySelector('.usa-input-error #root_veteranSocialSecurityNumber')).to.be.null;
    expect(formDOM.querySelector('.usa-input-error #root_vaFileNumber')).not.to.be.null;
  });
});
