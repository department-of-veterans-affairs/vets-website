import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, wrapSchemas } from '../../../util/schemaform-utils.jsx';
import { schema as rawSchema, uiSchema as rawUiSchema } from '../../../../src/js/common/schemaform/definitions/nonMilitaryJobs';

describe('Schemaform definition nonMilitaryJobs', () => {
  const { schema, uiSchema } = wrapSchemas(rawSchema, rawUiSchema, 'nonMilitaryJobs');

  it('should render nonMilitaryJobs', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    const inputs = formDOM.querySelectorAll('input');

    expect(inputs.length).to.equal(4);
  });

  it('should add another', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    ReactTestUtils.Simulate.change(formDOM.querySelector('input'), {
      target: {
        value: 'A job title'
      }
    });
    ReactTestUtils.Simulate.click(formDOM.querySelector('.va-growable-add-btn'));

    expect(formDOM.querySelector('.va-growable-background').textContent)
      .to.contain('A job title');
  });
});
