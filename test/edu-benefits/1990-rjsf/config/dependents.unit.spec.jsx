import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { getFormDOM } from '../../../util/schemaform-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1990-rjsf/config/form.js';

describe('Edu 1990 dependents', () => {
  const { schema, uiSchema } = formConfig.chapters.personalInformation.pages.dependents;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            toursOfDuty: [
              {
                from: '12-12-1970',
                to: '12-12-1990'
              }
            ]
          }}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(6);
  });
  it('should submit form without information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            toursOfDuty: [
              {
                from: '12-12-1970',
                to: '12-12-1990'
              }
            ]
          }}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
  });
});
