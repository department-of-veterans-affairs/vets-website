import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../../config/form';
import { simulateInputChange } from '../../../helpers';

describe('hca Other Toxic Exposure Dates config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.otherToxicExposureDates;
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
    expect(formDOM.querySelectorAll('input, select').length).to.equal(4);
  });

  it('should submit empty form', () => {
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should not submit when exposure start date is greater than exposure end date', () => {
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

    simulateInputChange(
      formDOM,
      '#root_view\\3A toxicExposureDates_toxicExposureStartDateMonth',
      '5',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A toxicExposureDates_toxicExposureStartDateYear',
      '1990',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A toxicExposureDates_toxicExposureEndDateMonth',
      '5',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A toxicExposureDates_toxicExposureEndDateYear',
      '1989',
    );
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should not submit when service start date is equal to service end date', () => {
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

    simulateInputChange(
      formDOM,
      '#root_view\\3A toxicExposureDates_toxicExposureStartDateMonth',
      '5',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A toxicExposureDates_toxicExposureStartDateYear',
      '1990',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A toxicExposureDates_toxicExposureEndDateMonth',
      '5',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A toxicExposureDates_toxicExposureEndDateYear',
      '1990',
    );
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
