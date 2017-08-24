import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { getFormDOM, DefinitionTester } from '../../../util/schemaform-utils';

import formConfig from '../../../../src/js/edu-benefits/1990-rjsf/config/form.js';

describe('Edu 1990 directDeposit', () => {
  const { schema, uiSchema } = formConfig.chapters.personalInformation.pages.directDeposit;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(4);
  });
  it('should submit form without information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
  });
});
