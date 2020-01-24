import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { $$ } from '../../helpers';

import formConfig from '../../config/form.js';
import officeForReview from '../../pages/officeForReview';

const { schema, uiSchema } = officeForReview;

describe('Higher-Level Review 0996 office for review', () => {
  it('should render the yes/no widget radios', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    expect($$('input[type="radio"]', formDOM).length).to.equal(2);
    // No info alert
    expect($$('.usa-alert-info', formDOM).length).to.equal(0);
  });

  it('should allow submit with no change', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should render the info alert only when "No" is selected for same office', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          sameOffice: false,
        }}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    expect($$('.usa-alert-info', formDOM).length).to.equal(1);
    formDOM.setYesNo('#root_sameOfficeYes', 'Y');
    submitForm(form);
    expect($$('.usa-alert-info', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
