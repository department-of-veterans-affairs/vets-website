import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm, getFormDOM } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/burials/config/form.js';

describe('Burials claimant information', () => {
  const { schema, uiSchema } = formConfig.chapters.additionalInformation.pages.claimantContactInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(9);
  });
  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect((formDOM.querySelectorAll('.usa-input-error')).length).to.equal(7);
    expect(onSubmit.called).not.to.be.true;
  });
  it('should submit when all required fields are filled in', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_claimantAddress_street', '101 Elm st');
    formDOM.fillData('#root_claimantAddress_city', 'Northampton');
    formDOM.fillData('#root_claimantAddress_state', 'MA');
    formDOM.fillData('#root_claimantAddress_postalCode', '01060');
    formDOM.fillData('#root_claimantEmail', 'Jane.Smith@gmail.com');
    formDOM.fillData('#root_view\\:claimantEmailConfirmation', 'Jane.Smith@gmail.com');
    formDOM.fillData('#root_claimantPhone', '4444444444');

    submitForm(form);
    expect((formDOM.querySelectorAll('.usa-input-error')).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
  it('should not submit when emails do not match', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_claimantAddress_street', '101 Elm st');
    formDOM.fillData('#root_claimantAddress_city', 'Northampton');
    formDOM.fillData('#root_claimantAddress_state', 'MA');
    formDOM.fillData('#root_claimantAddress_postalCode', '01060');
    formDOM.fillData('#root_claimantEmail', 'Jane.Smith@gmail.com');
    formDOM.fillData('#root_view\\:claimantEmailConfirmation', 'Jane.R.Smith@gmail.com');
    formDOM.fillData('#root_claimantPhone', '4444444444');

    submitForm(form);
    expect((formDOM.querySelectorAll('.usa-input-error')).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
