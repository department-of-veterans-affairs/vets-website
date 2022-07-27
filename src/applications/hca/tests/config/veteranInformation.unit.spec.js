import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('HCA veteranInformation', () => {
  it('should render personal information page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.veteranInformation;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(4);
    expect(formDOM.querySelector('#root_veteranFullName_first')).not.to.be.null;
    expect(
      formDOM.querySelector('#root_veteranFullName_middle').maxLength,
    ).to.equal(30);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should render personal information ssn page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.ssnInformation;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(1);
    expect(formDOM.querySelector('#root_veteranSocialSecurityNumber')).not.to.be
      .null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should render personal information dob page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.dobInformation;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(3);
    expect(formDOM.querySelector('#root_veteranDateOfBirthMonth')).not.to.be
      .null;
    expect(formDOM.querySelector('#root_veteranDateOfBirthDay')).not.to.be.null;
    expect(formDOM.querySelector('#root_veteranDateOfBirthYear')).not.to.be
      .null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should render place of birth page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.birthInformation;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(2);

    submitForm(form);
    expect(onSubmit.called).to.be.true;
  });

  it("should render mother's maiden name  page", () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.maidenNameInformation;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(1);

    submitForm(form);
    expect(onSubmit.called).to.be.true;
  });

  it('should render birthSex page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.birthSex;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(2);
    expect(formDOM.querySelector('#root_gender_0')).not.to.be.null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should render maritalStatus page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.householdInformation.pages.maritalStatus;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(1);
    expect(formDOM.querySelector('#root_maritalStatus')).not.to.be.null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should render demographicInformation page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.demographicInformation;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(7);
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should render veteranAddress page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.veteranAddress;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(9);
    expect(formDOM.querySelector('#root_veteranAddress_country')).not.to.be
      .null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
  });

  it('should render contactInformation page', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.contactInformation;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={{}} uiSchema={uiSchema} />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(4);
    expect(formDOM.querySelector('#root_email')).not.to.be.null;
  });
});
