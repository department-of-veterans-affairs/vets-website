import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import { schema, uiSchema } from '../../../../src/js/common/schemaform/definitions/phone';

describe('Schemaform definition phone', () => {
  it('should render phone', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema()}/>
    );

    const formDOM = findDOMNode(form);

    const input = formDOM.querySelector('input');
    expect(input.type).to.equal('tel');
    expect(input.classList.contains('home-phone')).to.be.true;
    expect(input.classList.contains('va-input-medium-large')).to.be.true;
  });
  it('should render phone title', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema('My phone')}/>
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelector('label').textContent).to.equal('My phone');
  });
});
