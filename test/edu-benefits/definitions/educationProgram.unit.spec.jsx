import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../util/schemaform-utils.jsx';
import * as formConfig from '../../../src/js/edu-benefits/definitions/educationProgram';
import { educationProgram, educationType, date } from 'vets-json-schema/dist/definitions.json';

const schemaWithEdu = {
  definitions: {
    educationProgram,
    educationType,
    date
  }
};

describe('Edu educationProgram', () => {
  const { schema, uiSchema } = formConfig;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema(schemaWithEdu)}
          data={{}}
          definitions={{ educationType }}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    const inputs = Array.from(formDOM.querySelectorAll('input, select'));

    expect(inputs.length).to.equal(2);
  });

  it('should show address conditionally', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema(schemaWithEdu)}
          data={{}}
          definitions={{ educationType }}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    // Look for the address; shouldn't be there
    expect(formDOM.querySelector('#root_address_country')).to.be.null;

    // Change the education type
    ReactTestUtils.Simulate.change(find('#root_educationType'), {
      target: {
        value: 'college'
      }
    });

    // Look for the address again; should be there
    expect(formDOM.querySelector('#root_address_country')).not.to.be.null;
  });
});
