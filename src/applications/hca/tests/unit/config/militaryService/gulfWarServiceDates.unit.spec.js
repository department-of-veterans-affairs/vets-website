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

describe('hca Gulf War Service Dates config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.gulfWarServiceDates;
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

  it('should not submit when service start date is greater than service end date', () => {
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
      '#root_view\\3A gulfWarServiceDates_gulfWarStartDateMonth',
      '5',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A gulfWarServiceDates_gulfWarStartDateYear',
      '1990',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A gulfWarServiceDates_gulfWarEndDateMonth',
      '5',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A gulfWarServiceDates_gulfWarEndDateYear',
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
      '#root_view\\3A gulfWarServiceDates_gulfWarStartDateMonth',
      '5',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A gulfWarServiceDates_gulfWarStartDateYear',
      '1990',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A gulfWarServiceDates_gulfWarEndDateMonth',
      '5',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A gulfWarServiceDates_gulfWarEndDateYear',
      '1990',
    );
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
