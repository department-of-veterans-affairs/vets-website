import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';
import uiSchema from '../../definitions/fullName';

describe('Pre-need Schemaform definition fullName', () => {
  it('should render fullName', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={definitions.fullName} uiSchema={uiSchema} />,
    );
    const formDOM = findDOMNode(form);
    const inputs = formDOM.querySelectorAll('input');
    expect(inputs.length).to.equal(2);
  });
});
