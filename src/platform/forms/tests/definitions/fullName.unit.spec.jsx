import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester } from '../../../testing/unit/schemaform-utils.jsx';
import uiSchema from '../../definitions/fullName';
import { fullName as schema } from 'vets-json-schema/dist/definitions.json';

describe('Schemaform definition fullName', () => {
  it('should render fullName', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    const formDOM = findDOMNode(form);

    const inputs = formDOM.querySelectorAll('input');
    const selects = formDOM.querySelectorAll('select');
    expect(inputs.length).to.equal(3);
    expect(selects.length).to.equal(1);
    expect(selects[0].classList.contains('form-select-medium')).to.be.true;
  });
});
