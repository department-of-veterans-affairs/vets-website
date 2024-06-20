import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('Edu 5490 applicantInformation', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={{}} uiSchema={uiSchema} />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(15);
  });
});

const defaults = prefix => ({
  fields: [
    `${prefix}FullName`,
    'view:noSSN',
    `${prefix}SocialSecurityNumber`,
    `${prefix}DateOfBirth`,
    'minorHighSchoolQuestions',
    'gender',
    'relationshipAndChildType',
  ],
  required: [
    `${prefix}FullName`,
    `${prefix}DateOfBirth`,
    'relationshipAndChildType',
  ],
  labels: {},
  isVeteran: false,
});

describe('Edu 5490 applicantInformation SET isVeteran True', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;
  it('should render', () => {
    const data = defaults('Mr');
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={data} uiSchema={uiSchema} />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(15);
  });
});
