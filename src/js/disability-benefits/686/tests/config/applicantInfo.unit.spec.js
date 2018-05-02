import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData, selectRadio, getFormDOM, submitForm } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';
import ReactTestUtils from 'react-dom/test-utils';

describe('686 veteran information', () => {
  const { schema, uiSchema } = formConfig.chapters.veteranInformation.pages.veteranInformation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );
    expect(form.find('input').length).to.equal(8);
    expect(form.find('select').length).to.equal(1);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit form if applicant is veteran', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );
    fillData(form, 'input#root_fullName_first', 'test');
    fillData(form, 'input#root_fullName_last', 'test');
    fillData(form, 'input#root_ssnOrVa', '222-23-2425');
    selectRadio(form, 'root_relationship', 'veteran');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should expand applicant info if applicant is not veteran', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        uiSchema={uiSchema}/>
    );

    selectRadio(form, 'root_relationship', 'other');

    expect(form.find('input').length).to.equal(18);
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
    formDOM.fillData('input#root_fullName_first', 'test');
    formDOM.fillData('input#root_fullName_last', 'test');
    formDOM.fillData('input#root_ssnOrVa', '222-23-2425');
    formDOM.selectRadio('root_relationship', 'other');

    formDOM.fillData('#root_view\\:applicantInfo_fullName_first', 'hey');
    formDOM.fillData('#root_view\\:applicantInfo_fullName_last', 'test');
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
