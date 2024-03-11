import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
  getFormDOM,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../../config/form';
import { simulateInputChange } from '../../../helpers';

describe('hca MedicarePartAEffectiveDate config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.medicarePartAEffectiveDate;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    expect(
      formDOM.querySelector('#root_medicareClaimNumber').maxLength,
    ).to.equal(30);
    expect(formDOM.querySelectorAll('input').length).to.equal(2);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);

    simulateInputChange(formDOM, '#root_medicarePartAEffectiveDateMonth', '1');
    simulateInputChange(formDOM, '#root_medicarePartAEffectiveDateDay', '1');
    simulateInputChange(
      formDOM,
      '#root_medicarePartAEffectiveDateYear',
      '2000',
    );
    simulateInputChange(formDOM, '#root_medicareClaimNumber', '7AD5WC9MW60');
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
