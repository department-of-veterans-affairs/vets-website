import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/5490/config/form';

describe('Edu 5490 schoolSelection', () => {
  const { schema, uiSchema } = formConfig.chapters.schoolSelection.pages.schoolSelection;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    const inputs = Array.from(formDOM.querySelectorAll('input, select'));

    expect(inputs.length).to.equal(12);
  });

  it('should show address conditionally', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    // Look for the address; shouldn't be there
    expect(formDOM.querySelector('#root_educationProgram_address_country')).to.be.null;

    // Change the education type
    ReactTestUtils.Simulate.change(find('#root_educationProgram_educationType'), {
      target: {
        value: 'college'
      }
    });

    // Look for the address again; should be there
    expect(formDOM.querySelector('#root_educationProgram_address_country')).not.to.be.null;
  });
});
