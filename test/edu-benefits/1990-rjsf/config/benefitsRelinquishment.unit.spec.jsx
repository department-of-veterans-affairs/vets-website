import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { getFormDOM } from '../../../util/schemaform-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1990-rjsf/config/form.js';

describe('Edu 1990 benefitsRelinquishment', () => {
  const { schema, uiSchema } = formConfig.chapters.benefitsEligibility.pages.benefitsRelinquishment;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            'view:selectedBenefits': {
              chapter30: true
            }
          }}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(4);
  });

  it('should not submit form without information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            'view:selectedBenefits': {
              chapter30: true
            }
          }}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
  });

  it('should submit with required information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            'view:selectedBenefits': {
              chapter30: true
            }
          }}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    // Should only require one
    formDOM.selectRadio('benefitsRelinquished', 'unknown');

    formDOM.submitForm();
    expect(formDOM.querySelectorAll('.usa-input-error #root_veteranDateOfBirthMonth').length).to.equal(0);
  });

  it.skip('should require nested content', () => {
    // const form = ReactTestUtils.renderIntoDocument(
    //   <DefinitionTester
    //       schema={schema}
    //       data={{ chapter30: true }}
    //       uiSchema={uiSchema}/>
    // );
    // const formDOM = getFormDOM(form);
  });
});
