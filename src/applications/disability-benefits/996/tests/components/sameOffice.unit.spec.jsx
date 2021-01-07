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
import initialData from '../schema/initialData.js';

describe('Higher-Level Review 0996 choose same office', () => {
  const { schema, uiSchema } = formConfig.chapters.sameOffice.pages.sameOffice;
  // Office for review section
  it('should render the same office yes/no radio', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    const radios = $$('[name="root_sameOffice"]', formDOM);
    expect(radios).to.have.lengthOf(2);
    // "No" should be selected by default
    expect(radios[1].checked).to.be.true;
  });

  it('should allow submit', () => {
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
    formDOM.setYesNo('[name="root_sameOffice"]', true);
    submitForm(form);
    expect(onSubmit.called).to.be.true;
  });
});
