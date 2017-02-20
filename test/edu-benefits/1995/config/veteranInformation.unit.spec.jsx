import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';
import Form from 'react-jsonschema-form';

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
  it.only('should conditionally require file number', () => {
    const onSubmit = () => console.log('submitted!');
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });

    // show error for ssn, file number not visible
    expect(formDOM.querySelector('#root_vaFileNumber')).to.be.null;
    expect(formDOM.querySelector('.usa-input-error #root_veteranSocialSecurityNumber')).not.to.be.null;

    ReactTestUtils.Simulate.change(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')[3],
      {
        target: {
          checked: true
        }
      });

    // no error for ssn, file number is visible with error
    expect(formDOM.querySelector('.usa-input-error #root_veteranSocialSecurityNumber')).to.be.null;
    expect(formDOM.querySelector('#root_vaFileNumber')).not.to.be.null;
  });
  it('should have no errors with all info filled in', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });
    form.forceUpdate();
    const f = formDOM.querySelector.bind(formDOM);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be.empty;

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
