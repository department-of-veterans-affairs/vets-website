import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { DefinitionTester, getFormDOM, submitForm } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';
import ReactTestUtils from 'react-dom/test-utils';

describe('686 veteran information', () => {
  const { schema, uiSchema } = formConfig.chapters.veteranInformation.pages.veteranInformation;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    expect(formDOM.querySelectorAll('input, select').length).to.equal(9);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit form if applicant is veteran', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    formDOM.fillData('input#root_veteranFullName_first', 'test');
    formDOM.fillData('input#root_veteranFullName_last', 'test');
    formDOM.fillData('input#root_ssnOrVa', '222-23-2425');
    formDOM.selectRadio('root_view:relationship', 'veteran');

    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should expand applicant info if applicant is not veteran', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    formDOM.selectRadio('root_view:relationship', 'other');
    expect(formDOM.querySelectorAll('input').length).to.equal(17);
  });


  it('should submit form if applicant is not veteran', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    formDOM.fillData('input#root_veteranFullName_first', 'test');
    formDOM.fillData('input#root_veteranFullName_last', 'test');
    formDOM.fillData('input#root_ssnOrVa', '222-23-2425');
    formDOM.selectRadio('root_view:relationship', 'other');

    formDOM.fillData('#root_view\\:applicantInfo_claimantFullName_first', 'test');
    formDOM.fillData('#root_view\\:applicantInfo_claimantFullName_last', 'test');
    formDOM.fillData('#root_view\\:applicantInfo_ssn', '222-23-2425');
    formDOM.fillData('#root_view\\:applicantInfo_address_street', 'test st');
    formDOM.fillData('#root_view\\:applicantInfo_address_city', 'test city');
    formDOM.fillData('#root_view\\:applicantInfo_address_state', 'MA');
    formDOM.fillData('#root_view\\:applicantInfo_address_postalCode', '91111');
    formDOM.fillData('#root_view\\:applicantInfo_claimantEmail', 'test@gmail.com');

    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
