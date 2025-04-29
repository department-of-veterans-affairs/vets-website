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
import { simulateInputChange } from '../../../helpers';

describe('hca VaBenefitsPackage config', () => {
  const { vaBenefitsPackage } = formConfig.chapters.vaBenefits.pages;
  const { schema, uiSchema } = vaBenefitsPackage;
  const { defaultDefinitions: definitions } = formConfig;
  const subject = ({ onSubmit = () => {} }) => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
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
    const { selectors } = subject({});
    expect(selectors().inputs.length).to.equal(2);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const { form, selectors } = subject({ onSubmit });
    submitForm(form);
    expect(selectors().errors.length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const { form, formDOM, selectors } = subject({ onSubmit });
    const inputID = '#root_view\\3A vaBenefitsPackage_1';
    simulateInputChange(formDOM, inputID, 'regOnly');
    submitForm(form);
    expect(selectors().errors.length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
