import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../util/schemaform-utils.jsx';
import * as formConfig from '../../../src/js/edu-benefits/definitions/veteranId';
import definitions from 'vets-json-schema/dist/definitions.json';

describe('Edu veteranId', () => {
  const { schema, uiSchema } = formConfig;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          definitions={definitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    const inputs = Array.from(formDOM.querySelectorAll('input, select'));

    expect(inputs.length).to.equal(2);
  });
});
