import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';
import Form from 'react-jsonschema-form';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1995/config/form';

describe('Edu 1995 veteranInformation', () => {
  const { schema, uiSchema } = formConfig.chapters.veteranInformation.pages.veteranInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input'))
      .to.not.be.empty;
  });
  it('should conditionally require file number', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });

    // show error for ssn, file number not visible
    expect(formDOM.querySelector('#root_vaFileNumber')).to.be.null;
    expect(formDOM.querySelector('.usa-input-error #root_veteranSocialSecurityNumber')).not.to.be.null;
    const noSSNBox = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')
      .find(input => input.getAttribute('name') === 'root_view:noSSN');

    ReactTestUtils.Simulate.change(noSSNBox,
      {
        target: {
          checked: true
        }
      });

    // no error for ssn, file number is visible with error
    expect(formDOM.querySelector('.usa-input-error #root_veteranSocialSecurityNumber')).to.be.null;
    expect(formDOM.querySelector('.usa-input-error #root_vaFileNumber')).not.to.be.null;
  });
  it('should have no errors with all info filled in', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });
    const find = formDOM.querySelector.bind(formDOM);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be.empty;

    ReactTestUtils.Simulate.change(find('#root_veteranFullName_first'), {
      target: {
        value: 'Test'
      }
    });
    ReactTestUtils.Simulate.change(find('#root_veteranFullName_last'), {
      target: {
        value: 'Test'
      }
    });
    ReactTestUtils.Simulate.change(find('#root_veteranSocialSecurityNumber'), {
      target: {
        value: '123456788'
      }
    });

    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });

    expect(onSubmit.called).to.be.true;
  });
});
