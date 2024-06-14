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

describe('hca VeteranDateOfBirth config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.dobInformation;
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
    expect(formDOM.querySelectorAll('input, select').length).to.equal(3);
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
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

    simulateInputChange(formDOM, '#root_veteranDateOfBirthMonth', '3');
    simulateInputChange(formDOM, '#root_veteranDateOfBirthDay', '2');
    simulateInputChange(formDOM, '#root_veteranDateOfBirthYear', '1980');
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should not submit when date of birth is greater than the current date', () => {
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

    simulateInputChange(
      formDOM,
      '#root_veteranDateOfBirthMonth',
      today.getMonth() + 1,
    );
    simulateInputChange(
      formDOM,
      '#root_veteranDateOfBirthDay',
      today.getDate() + 1,
    );
    simulateInputChange(
      formDOM,
      '#root_veteranDateOfBirthYear',
      today.getFullYear(),
    );
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should not submit when date of birth is before 01-01-1900', () => {
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

    simulateInputChange(formDOM, '#root_veteranDateOfBirthMonth', '12');
    simulateInputChange(formDOM, '#root_veteranDateOfBirthDay', '31');
    simulateInputChange(formDOM, '#root_veteranDateOfBirthYear', '1899');
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
