import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';

describe('hca AnnualIncome config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.v1AnnualIncome;
  const { defaultDefinitions: definitions } = formConfig;
  const formData = {
    maritalStatus: 'Married',
    'view:reportDependents': true,
    dependents: [
      {
        fullName: {
          first: 'John',
          last: 'Doe',
        },
        dependentRelation: 'Son',
      },
      {
        fullName: {
          first: 'Jane',
          last: 'Doe',
        },
        dependentRelation: 'Daughter',
      },
    ],
  };

  it('should render without spouse information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    expect(formDOM.querySelectorAll('input, select').length).to.equal(3);
  });

  it('should render with spouse information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
        data={{ maritalStatus: 'Married' }}
      />,
    );
    const formDOM = findDOMNode(form);
    expect(formDOM.querySelectorAll('input, select').length).to.equal(6);
  });

  it('should render with dependent information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
        data={formData}
      />,
    );
    const formDOM = findDOMNode(form);
    expect(formDOM.querySelectorAll('input, select').length).to.equal(12);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        data={formData}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(12);
    expect(onSubmit.called).to.be.false;
  });
});
