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

describe('hca Military Service Information config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.serviceInformation;
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
    expect(formDOM.querySelectorAll('input, select').length).to.equal(8);
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
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
    const formDOM = findDOMNode(form);

    simulateInputChange(formDOM, '#root_lastServiceBranch', 'army');
    simulateInputChange(formDOM, '#root_lastEntryDateMonth', '1');
    simulateInputChange(formDOM, '#root_lastEntryDateDay', '1');
    simulateInputChange(formDOM, '#root_lastEntryDateYear', '1990');
    simulateInputChange(formDOM, '#root_lastDischargeDateMonth', '1');
    simulateInputChange(formDOM, '#root_lastDischargeDateDay', '1');
    simulateInputChange(formDOM, '#root_lastDischargeDateYear', '2011');
    simulateInputChange(formDOM, '#root_dischargeType', 'general');
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

    simulateInputChange(formDOM, '#root_lastServiceBranch', 'army');
    simulateInputChange(formDOM, '#root_lastEntryDateMonth', '5');
    simulateInputChange(formDOM, '#root_lastEntryDateDay', '1');
    simulateInputChange(formDOM, '#root_lastEntryDateYear', '1990');
    simulateInputChange(formDOM, '#root_lastDischargeDateMonth', '1');
    simulateInputChange(formDOM, '#root_lastDischargeDateDay', '1');
    simulateInputChange(formDOM, '#root_lastDischargeDateYear', '1990');
    simulateInputChange(formDOM, '#root_dischargeType', 'general');
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

    simulateInputChange(formDOM, '#root_lastServiceBranch', 'army');
    simulateInputChange(formDOM, '#root_lastEntryDateMonth', '1');
    simulateInputChange(formDOM, '#root_lastEntryDateDay', '1');
    simulateInputChange(formDOM, '#root_lastEntryDateYear', '1990');
    simulateInputChange(formDOM, '#root_lastDischargeDateMonth', '1');
    simulateInputChange(formDOM, '#root_lastDischargeDateDay', '1');
    simulateInputChange(formDOM, '#root_lastDischargeDateYear', '1990');
    simulateInputChange(formDOM, '#root_dischargeType', 'general');
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should not submit when service end date is greater than one year from today', () => {
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
    const today = new Date();

    simulateInputChange(formDOM, '#root_lastServiceBranch', 'army');
    simulateInputChange(formDOM, '#root_lastEntryDateMonth', '1');
    simulateInputChange(formDOM, '#root_lastEntryDateDay', '1');
    simulateInputChange(formDOM, '#root_lastEntryDateYear', '1990');
    simulateInputChange(
      formDOM,
      '#root_lastDischargeDateMonth',
      today.getMonth() + 1,
    );
    simulateInputChange(
      formDOM,
      '#root_lastDischargeDateDay',
      today.getDate() + 1,
    );
    simulateInputChange(
      formDOM,
      '#root_lastDischargeDateYear',
      today.getFullYear() + 1,
    );
    simulateInputChange(formDOM, '#root_dischargeType', 'general');
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should not submit when start date is less than 15 years from Veterans date of birth', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        data={{
          veteranDateOfBirth: '1976-01-01',
        }}
      />,
    );
    const formDOM = findDOMNode(form);

    simulateInputChange(formDOM, '#root_lastServiceBranch', 'army');
    simulateInputChange(formDOM, '#root_lastEntryDateMonth', '1');
    simulateInputChange(formDOM, '#root_lastEntryDateDay', '1');
    simulateInputChange(formDOM, '#root_lastEntryDateYear', '1990');
    simulateInputChange(formDOM, '#root_lastDischargeDateMonth', '1');
    simulateInputChange(formDOM, '#root_lastDischargeDateDay', '1');
    simulateInputChange(formDOM, '#root_lastDischargeDateYear', '2000');
    simulateInputChange(formDOM, '#root_dischargeType', 'general');
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
