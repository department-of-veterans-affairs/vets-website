import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import definitions from 'vets-json-schema/dist/definitions.json';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import uiSchema from '../../../src/js/definitions/fullName';

describe('Schemaform definition fullName', () => {
  it('should render fullName', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={definitions.fullName} uiSchema={uiSchema} />,
    );

    const formDOM = findDOMNode(form);

    const inputs = formDOM.querySelectorAll('input');
    const selects = formDOM.querySelectorAll('select');
    expect(inputs.length).to.equal(3);
    expect(selects.length).to.equal(1);
    expect(selects[0].classList.contains('form-select-medium')).to.be.true;
    expect(inputs[0].autocomplete).to.equal('given-name');
    expect(inputs[1].autocomplete).to.equal('additional-name');
    expect(inputs[2].autocomplete).to.equal('family-name');
  });
});
