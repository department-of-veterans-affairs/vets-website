import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import moment from 'moment';

import { DefinitionTester, getFormDOM } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form.js';

describe('Child information page', () => {
  const schema = formConfig.chapters.householdInformation.pages.childrenInformation.schema.properties.dependents.items;
  const uiSchema = formConfig.chapters.householdInformation.pages.childrenInformation.uiSchema.dependents.items;
  let dependentData = {
    'view:hasDependents': true,
    dependents: [
      {
        fullName: {
          first: 'Jane',
          last: 'Doe'
        },
        dependentRelationship: 'child',
      }
    ]
  };
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={dependentData}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(8);
  });

  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={dependentData}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    formDOM.submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).not.to.be.true;
  });

  // Skipped because it's an array page with a ui:required
  it.skip('should not require ssn if noSSN is checked', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={dependentData}
          pagePerItemIndex={0}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    formDOM.setCheckbox('#root_view\\:noSSN', true);
    formDOM.submitForm(form);
    const errors = formDOM.querySelectorAll('.usa-input-error-label');

    errors.forEach(e => console.log(e.getAttribute('for'))); // eslint-disable-line no-console

    expect(errors.length).to.equal(3);
    expect(onSubmit.called).not.to.be.true;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={dependentData}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_childPlaceOfBirth', 'sf');
    formDOM.fillData('#root_childSocialSecurityNumber', '123123123');
    formDOM.fillData('#root_childRelationship_0', 'biological');
    formDOM.fillData('#root_previouslyMarriedNo', 'Y');

    formDOM.submitForm(form);
    expect(onSubmit.called).to.be.true;
  });

  // Skipping these until we DefinitionTester deals with showPagePerItem pages
  it.skip('should ask if the child is in school', () => {
    const data = Object.assign({}, dependentData);
    data.dependents[0].childDateOfBirth = moment().subtract(19, 'years').toString();

    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={data}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelector('#root_attendingCollegeYes')).to.not.be.null;
  });

  // Could be in the above test...
  it.skip('should ask if the child is disabled', () => {
    const data = Object.assign({}, dependentData);
    data.dependents[0].childDateOfBirth = moment().subtract(19, 'years').toString();

    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={data}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelector('#root_disabledYes')).to.not.be.null;
  });
});
