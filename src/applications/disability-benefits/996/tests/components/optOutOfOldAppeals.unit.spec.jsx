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

import formConfig from '../../config/form';
import initialData from '../schema/initialData';

const { optOutOfOldAppeals } = formConfig.chapters.step1.pages;

describe('Higher-Level Review Opt out of old appeals', () => {
  it('should render opt out of old appeals checkbox', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={optOutOfOldAppeals.schema}
        uiSchema={optOutOfOldAppeals.uiSchema}
        data={initialData}
        formData={initialData}
      />,
    );

    const formDOM = getFormDOM(form);
    expect($('#legacyOptInApproved', formDOM)).to.exist;
  });

  it('prevents you from continuing if opt out checkbox is not checked', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={optOutOfOldAppeals.schema}
        uiSchema={optOutOfOldAppeals.uiSchema}
        data={initialData}
        formData={initialData}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should allow you to continue once opt out checkbox is checked', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={optOutOfOldAppeals.schema}
        uiSchema={optOutOfOldAppeals.uiSchema}
        data={initialData}
        formData={initialData}
      />,
    );

    const formDOM = getFormDOM(form);
    formDOM.setCheckbox('#legacyOptInApproved', true);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
