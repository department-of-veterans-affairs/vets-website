import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  submitForm,
  DefinitionTester,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

describe('hca VaBenefitsPackage config', () => {
  const { vaBenefitsPackage } = formConfig.chapters.vaBenefits.pages;
  const { schema, uiSchema } = vaBenefitsPackage;
  const { defaultDefinitions: definitions } = formConfig;
  const subject = () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    const selectors = () => ({
      inputs: formDOM.querySelectorAll('input'),
      errors: formDOM.querySelectorAll('.usa-input-error'),
    });
    return { form, formDOM, selectors };
  };

  it('should render correct number of inputs', () => {
    const { selectors } = subject();
    expect(selectors().inputs.length).to.equal(3);
  });

  it('should submit empty form', () => {
    const onSubmit = sinon.spy();
    const { form, selectors } = subject();
    submitForm(form);
    expect(selectors().errors.length).to.equal(0);
    expect(onSubmit.called).to.be.false;
  });
});
