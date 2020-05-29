import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { $, $$ } from '../../helpers';

import formConfig from '../../config/form.js';
import initialData from '../schema/initialData.js';

describe('Higher-Level Review 0996 choose contested issues', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.contestedIssues.pages.contestedIssues;

  it('renders the contested issue selection field', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    expect(
      $$('.widget-outline input[type="checkbox"]', formDOM).length,
    ).to.equal(initialData.contestedIssues.length);
  });

  it('successfully submits when at least one condition is selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    formDOM.setCheckbox('#root_contestedIssues_0', true);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('prevents submission when no conditions selected', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(1);
  });

  it('renders the information about each disability', () => {
    const issues = initialData.contestedIssues;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    $$('.widget-outline label', formDOM).forEach((label, index) => {
      const data = issues[index].attributes;
      expect($('h3', label).textContent).to.equal(data.issue);
      expect($('span', label).textContent).to.equal(data.subjectText || '');
      expect($('.widget-content p', label).textContent).to.equal(
        `Current rating: ${data.percentNumber}%`,
      );
    });
  });

  // Office for review section
  it('should render the same office checkbox', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    expect($('#root_sameOffice', formDOM)).to.not.be.false;
  });

  // "No" should be selected by default
  it('should show info alert when checked', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    formDOM.setCheckbox('#root_sameOffice', true);
    expect($('#root_sameOfficeAlert__title', formDOM)).to.not.be.false;
  });
});
