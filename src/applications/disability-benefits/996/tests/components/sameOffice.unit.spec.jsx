import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { $ } from '../../helpers';

import formConfig from '../../config/form.js';
import initialData from '../schema/initialData.js';

describe('Higher-Level Review 0996 choose same office', () => {
  const { schema, uiSchema } = formConfig.chapters.sameOffice.pages.sameOffice;
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
