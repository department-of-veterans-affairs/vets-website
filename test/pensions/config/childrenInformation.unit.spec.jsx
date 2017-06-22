import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, getFormDOM } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form.js';

describe('Child information page', () => {
  const schema = formConfig.chapters.householdInformation.pages.childrenInformation.schema.properties.dependents.items;
  const uiSchema = formConfig.chapters.householdInformation.pages.childrenInformation.uiSchema.dependents.items;
  let nameData = {
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
          data={nameData}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(9);
  });

  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={nameData}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    formDOM.submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).not.to.be.true;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={nameData}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_childPlaceOfBirth', 'sf');
    formDOM.fillData('#root_childSocialSecurityNumber', '123123123');
    formDOM.fillData('#root_childRelationship_0', 'biological');
    formDOM.fillData('#root_disabledYes', 'Y');
    formDOM.fillData('#root_previouslyMarriedNo', 'Y');

    formDOM.submitForm(form);
    expect(onSubmit.called).to.be.true;
  });
});
