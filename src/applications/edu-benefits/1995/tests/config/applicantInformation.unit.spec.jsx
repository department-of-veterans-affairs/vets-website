import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';
import {
  applicantInformationField,
  benefitSelectionSchema,
  benefitSelectionUiSchema,
  directDepositField,
  newSchoolSchema,
  newSchoolUiSchema,
} from '../../config/chapters';

const definitions = formConfig.defaultDefinitions;

describe('Edu 1995 applicantInformation', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    );
    expect(inputs.length).to.equal(8);
  });

  it('should conditionally require SSN or file number', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        formData={{}}
        schema={schema}
        definitions={definitions}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    submitForm(form);

    // Use Array find() for nodes with 'view:' in the id, and check for ok (truthiness) instead of null since
    // not found nodes will return undefined instead of null

    // VA file number input is not visible; error is shown for empty SSN input
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    );
    expect(
      inputs.find(input => input.id === 'root_veteranSocialSecurityNumber'),
    ).to.be.ok;
    expect(inputs.find(input => input.id === 'root_vaFileNumber')).not.to.be.ok;

    const errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      form,
      'usa-input-error-message',
    );
    expect(
      errors.find(input =>
        input.id.includes('root_veteranSocialSecurityNumber'),
      ),
    ).to.be.ok;

    // Check no-SSN box
    const noSSNBox = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    ).find(input => input.id === 'root_view:noSSN');
    ReactTestUtils.Simulate.change(noSSNBox, {
      target: {
        checked: true,
      },
    });

    // No error is shown for empty SSN input; error is shown for empty file number input
    const newErrors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      form,
      'usa-input-error-message',
    );
    expect(
      newErrors.find(input =>
        input.id.includes('root_veteranSocialSecurityNumber'),
      ),
    ).not.to.be.ok;
    expect(newErrors.find(input => input.id.includes('root_vaFileNumber'))).to
      .be.ok;
  });
  it('should submit with no errors with all required fields filled in', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    const find = formDOM.querySelector.bind(formDOM);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be
      .empty;

    ReactTestUtils.Simulate.change(find('#root_veteranFullName_first'), {
      target: {
        value: 'Test',
      },
    });
    ReactTestUtils.Simulate.change(find('#root_veteranFullName_last'), {
      target: {
        value: 'Test',
      },
    });
    const ssn = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    ).find(input => input.id === 'root_veteranSocialSecurityNumber');
    ReactTestUtils.Simulate.change(ssn, {
      target: {
        value: '123456788',
      },
    });

    const birthMonth = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'select',
    ).find(select => select.id === 'root_dateOfBirthMonth');

    ReactTestUtils.Simulate.change(birthMonth, {
      target: {
        value: '1',
      },
    });

    const birthDay = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'select',
    ).find(input => input.id === 'root_dateOfBirthDay');
    ReactTestUtils.Simulate.change(birthDay, {
      target: {
        value: '1',
      },
    });
    const birthYear = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    ).find(input => input.id === 'root_dateOfBirthYear');
    ReactTestUtils.Simulate.change(birthYear, {
      target: {
        value: '1940',
      },
    });

    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be
      .empty;
    submitForm(form);
    expect(onSubmit.called).to.be.true;
  });
});

describe('Edu 1995 Fields for production', () => {
  it('should pass applicantInformation for production env', () => {
    const automatedTest = true;
    const applicantInformation = applicantInformationField(automatedTest);
    expect(applicantInformation).not.to.be.null;
  });
  it('should pass benefitSelection UiSchema for production env', () => {
    const automatedTest = true;
    const benefitSelection = benefitSelectionUiSchema(automatedTest);
    expect(benefitSelection).not.to.be.null;
  });
  it('should pass benefitSelection Schema for production env', () => {
    const automatedTest = true;
    const benefitSelection = benefitSelectionSchema(automatedTest);
    expect(benefitSelection).not.to.be.null;
  });
  it('should pass newSchool UiSchema for production env', () => {
    const automatedTest = true;
    const newSchool = newSchoolUiSchema(automatedTest);
    expect(newSchool).not.to.be.null;
  });
  it('should pass newSchool Schema for production env', () => {
    const automatedTest = true;
    const newSchool = newSchoolSchema(automatedTest);
    expect(newSchool).not.to.be.null;
  });
  it('should pass directDepositField for production env', () => {
    const automatedTest = true;
    const directDeposit = directDepositField(automatedTest);
    expect(directDeposit).not.to.be.null;
  });
});
