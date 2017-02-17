import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1995/config/form';

describe.only('Edu 1995 veteranInformation', () => {
  const { schema, uiSchema } = formConfig.chapters.veteranInformation.pages.veteranInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}/>
    );

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input'))
      .to.not.be.empty;
  });
  it('should conditionally require file number', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    // show error for ssn, file number not visible
    expect(formDOM.querySelector('#root_vaFileNumber')).to.be.falsy;
    expect(formDOM.querySelector('.usa-input-error #root_veteranSocialSecurityNumber')).to.be.truthy;

    ReactTestUtils.Simulate.click(formDOM.querySelector('input[type=checkbox]'));

    // no error for ssn, file number is visible with error
    expect(formDOM.querySelector('.usa-input-error #root_veteranSocialSecurityNumber')).to.be.truthy;
    expect(formDOM.querySelector('.usa-input-error #root_vaFileNumber')).to.be.truthy;
  });
  it('should have no errors with all info filled in', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    const f = formDOM.querySelector.bind(formDOM);
    ReactTestUtils.Simulate.click(f('button'));

    ReactTestUtils.Simulate.change(f('#root_veteranFullName_first'), {
      target: {
        value: 'Test'
      }
    });
    ReactTestUtils.Simulate.change(f('#root_veteranFullName_last'), {
      target: {
        value: 'Test'
      }
    });
    ReactTestUtils.Simulate.change(f('#root_veteranSocialSecurityNumber'), {
      target: {
        value: '16789'
      }
    });

    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
  });
});
