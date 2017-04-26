import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, wrapSchemas } from '../../util/schemaform-utils.jsx';
import rawUiSchema from '../../../src/js/edu-benefits/definitions/postHighSchoolTrainings';
import definitions from 'vets-json-schema/dist/definitions.json';

const rawSchema = definitions.postHighSchoolTrainings;

describe('Edu postHighSchoolTrainings', () => {
  const name = 'postHighSchoolTrainings';
  const { schema, uiSchema } = wrapSchemas(rawSchema, rawUiSchema, name);

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}/>
    );
    const fields = Array.from(findDOMNode(form).querySelectorAll('input, select'));

    expect(fields.length).to.equal(13);
  });

  it('should add another', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    ReactTestUtils.Simulate.change(formDOM.querySelector(`#root_${name}_0_name`), {
      target: {
        value: 'A college name'
      }
    });
    ReactTestUtils.Simulate.click(formDOM.querySelector('.va-growable-add-btn'));

    expect(formDOM.querySelector('.va-growable-background').textContent)
      .to.contain('A college name');
  });
});
