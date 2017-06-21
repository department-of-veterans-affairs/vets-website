import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, getFormDOM } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form.js';

describe('Pensions dependent list', () => {
  const { schema, uiSchema } = formConfig.chapters.householdInformation.pages.dependents;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(2);
  });

  it('should render dependent list', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_view\\:hasDependentsYes', 'Y');

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(8);
  });

  it('should render child date of birth', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_view\\:hasDependentsYes', 'Y');
    formDOM.fillData('#root_dependents_0_relationship_0', 'child');

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(11);
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
    const formDOM = getFormDOM(form);
    formDOM.submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error')).length).to.equal(1);
    expect(onSubmit.called).not.to.be.true;
  });

  it('should show errors when required fields are empty and has dependents', () => {
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
    formDOM.fillData('#root_view\\:hasDependentsYes', 'Y');
    formDOM.submitForm(form);

    expect(Array.from(formDOM.querySelectorAll('.usa-input-error')).length).to.equal(3);
    expect(onSubmit.called).not.to.be.true;
  });

  it('should add another dependent', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_view\\:hasDependentsYes', 'Y');
    formDOM.fillData('#root_dependents_0_fullName_first', 'Jane');
    formDOM.fillData('#root_dependents_0_fullName_last', 'Doe');
    formDOM.fillData('#root_dependents_0_relationship_0', 'child');
    ReactTestUtils.Simulate.click(formDOM.querySelector('.va-growable-add-btn'));

    expect(formDOM.querySelector('.va-growable-background').textContent)
      .to.contain('Jane Doe');
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_view\\:hasDependentsYes', 'Y');
    formDOM.fillData('#root_dependents_0_fullName_first', 'Jane');
    formDOM.fillData('#root_dependents_0_fullName_last', 'Doe');
    formDOM.fillData('#root_dependents_0_relationship_0', 'child');

    formDOM.submitForm(form);
    expect(onSubmit.called).to.be.true;
  });
});
