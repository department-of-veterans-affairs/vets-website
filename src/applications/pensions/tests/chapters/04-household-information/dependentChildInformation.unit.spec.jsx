import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import moment from 'moment';

import {
  DefinitionTester,
  getFormDOM,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
  arrayPath,
  title,
} = formConfig.chapters.householdInformation.pages.dependentChildInformation;

const dependentData = {
  'view:hasDependents': true,
  dependents: [
    {
      fullName: {
        first: 'Jane',
        last: 'Doe',
      },
      childDateOfBirth: moment()
        .subtract(19, 'years')
        .toISOString(),
    },
  ],
};

describe('Child information page', () => {
  // it('should render', () => {
  //   const form = ReactTestUtils.renderIntoDocument(
  //     <DefinitionTester
  //       arrayPath={arrayPath}
  //       pagePerItemIndex={0}
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       data={dependentData}
  //       uiSchema={uiSchema}
  //     />,
  //   );
  //   const formDOM = getFormDOM(form);

  //   expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(
  //     8,
  //   );
  // });

  // it('should show errors when required fields are empty', () => {
  //   const onSubmit = sinon.spy();
  //   const form = ReactTestUtils.renderIntoDocument(
  //     <DefinitionTester
  //       arrayPath={arrayPath}
  //       pagePerItemIndex={0}
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       onSubmit={onSubmit}
  //       data={dependentData}
  //       uiSchema={uiSchema}
  //     />,
  //   );
  //   const formDOM = getFormDOM(form);
  //   formDOM.submitForm(form);
  //   expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
  //   expect(onSubmit.called).not.to.be.true;
  // });

  // it('should not require ssn if noSSN is checked', () => {
  //   const onSubmit = sinon.spy();
  //   const form = ReactTestUtils.renderIntoDocument(
  //     <DefinitionTester
  //       arrayPath={arrayPath}
  //       pagePerItemIndex={0}
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       onSubmit={onSubmit}
  //       data={dependentData}
  //       uiSchema={uiSchema}
  //     />,
  //   );
  //   const formDOM = getFormDOM(form);
  //   formDOM.setCheckbox('#root_view\\:noSSN', true);
  //   formDOM.submitForm(form);
  //   const errors = formDOM.querySelectorAll('.usa-input-error-label');

  //   expect(errors.length).to.equal(3);
  //   expect(onSubmit.called).not.to.be.true;
  // });

  // it('should submit with valid data', () => {
  //   const onSubmit = sinon.spy();
  //   const form = ReactTestUtils.renderIntoDocument(
  //     <DefinitionTester
  //       arrayPath={arrayPath}
  //       pagePerItemIndex={0}
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       data={dependentData}
  //       onSubmit={onSubmit}
  //       uiSchema={uiSchema}
  //     />,
  //   );

  //   const formDOM = getFormDOM(form);

  //   formDOM.fillData('#root_childPlaceOfBirth', 'sf');
  //   formDOM.fillData('#root_childSocialSecurityNumber', '123123123');
  //   formDOM.fillData('#root_childRelationship_0', 'biological');
  //   formDOM.fillData('#root_previouslyMarriedNo', 'Y');

  //   formDOM.submitForm(form);
  //   expect(onSubmit.called).to.be.true;
  // });

  it('should ask if the child is in school', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={dependentData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelector('#root_attendingCollegeYes')).to.not.be.null;
  });

  it('should ask if the child is disabled', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={dependentData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelector('#root_disabledYes')).to.not.be.null;
  });

  it('should set the title to the dependents name if available', () => {
    const pageTitle = title;
    expect(pageTitle(dependentData.dependents[0])).to.eql(
      'Jane Doe information',
    );
    expect(pageTitle({ fullName: {} })).to.eql('  information');
  });
});
