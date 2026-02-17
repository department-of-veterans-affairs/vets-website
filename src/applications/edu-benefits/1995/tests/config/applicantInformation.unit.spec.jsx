import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import {
  applicantInformationField,
  directDepositField,
} from '../../config/chapters';
import { updateApplicantInformationPage } from '../../../utils/helpers';

const definitions = formConfig.defaultDefinitions;

describe('Edu 1995 applicantInformation', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  const { schema, uiSchema } =
    formConfig.chapters.applicantInformation.pages.applicantInformation;
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
  it('should render 8 inputs', () => {
    global.window.isProd = true;
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
  it('should conditionally require SSN or file number', async () => {
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
    await waitFor(() => {
      const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
        form,
        'input',
      );
      expect(
        inputs.find(input => input.id === 'root_veteranSocialSecurityNumber'),
      ).to.be.ok;
      expect(inputs.find(input => input.id === 'root_vaFileNumber')).not.to.be
        .ok;

      const errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        form,
        'usa-input-error-message',
      );
      expect(
        errors.find(input =>
          input.id.includes('root_veteranSocialSecurityNumber'),
        ),
      ).to.be.ok;
    });

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
    await waitFor(() => {
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
  });
  it('should submit with no errors with all required fields filled in', async () => {
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
    await waitFor(() => {
      expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be
        .empty;
    });

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

    await waitFor(() => {
      expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be
        .empty;
    });
    submitForm(form);
    expect(onSubmit.called).to.be.true;
  });
  it('should submit with no errors applicant under 18', async () => {
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
    await waitFor(() => {
      expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be
        .empty;
    });

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
        value: '2018',
      },
    });

    await waitFor(() => {
      expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be
        .empty;
    });

    const graduatedOrGED = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    ).find(
      input =>
        input.id === 'root_minorHighSchoolQuestions_minorHighSchoolQuestionYes',
    );
    ReactTestUtils.Simulate.change(graduatedOrGED, {
      target: {
        value: true,
      },
    });
    await waitFor(() => {
      expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be
        .empty;
    });

    ReactTestUtils.Simulate.change(graduatedOrGED, {
      target: {
        value: false,
      },
    });

    const noGraduatedOrGED = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    ).find(
      input =>
        input.id === 'root_minorHighSchoolQuestions_minorHighSchoolQuestionNo',
    );
    ReactTestUtils.Simulate.change(noGraduatedOrGED, {
      target: {
        value: true,
      },
    });

    await waitFor(() => {
      expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be
        .empty;
    });

    submitForm(form);
    expect(onSubmit.called).to.be.true;
  });
});

describe('Edu 1995 applicantInformationField function', () => {
  it('should return applicantInformation', () => {
    const applicantInformation = applicantInformationField();
    expect(applicantInformation).not.to.be.null;
  });

  it('should pass directDepositField', () => {
    const directDeposit = directDepositField();
    expect(directDeposit).not.to.be.null;
  });

  it('should include minorHighSchoolQuestions and applicantGender fields', () => {
    const result = applicantInformationField();

    expect(result).to.have.property('schema');
    expect(result.schema).to.have.property('properties');
    expect(result.schema.properties).to.have.property(
      'minorHighSchoolQuestions',
    );
    expect(result.schema.properties).to.have.property('applicantGender');
  });

  it('should set veteranSocialSecurityNumber as a required field', () => {
    const result = applicantInformationField();

    expect(result).to.have.property('schema');
    expect(result.schema).to.have.property('required');
    expect(result.schema.required).to.include('veteranSocialSecurityNumber');
  });

  it('should apply the uiSchema from applicantInformationUpdate', () => {
    const result = applicantInformationField();

    expect(result).to.have.property('uiSchema');
    expect(result.uiSchema).to.have.property('veteranFullName');
    expect(result.uiSchema).to.have.property('veteranSocialSecurityNumber');
    expect(result.uiSchema).to.have.property('dateOfBirth');
    expect(result.uiSchema).to.have.property('minorHighSchoolQuestions');
    expect(result.uiSchema).to.have.property('applicantGender');

    // Verify specific uiSchema properties from applicantInformationUpdate
    expect(result.uiSchema.veteranFullName).to.have.property('first');
    expect(result.uiSchema.veteranFullName.first).to.have.property(
      'ui:title',
      'Your first name',
    );
  });
});

describe('Edu 1995 updateApplicantInformationPage function', () => {
  it('should correctly process the applicant information page object', () => {
    const mockPage = {
      schema: {
        type: 'object',
        properties: {
          veteranFullName: { type: 'object' },
          veteranSocialSecurityNumber: { type: 'string' },
        },
      },
      uiSchema: {
        veteranFullName: { 'ui:title': 'Name' },
      },
    };

    const result = updateApplicantInformationPage(mockPage);

    // Verify the function returns a page object with schema and uiSchema
    expect(result).to.have.property('schema');
    expect(result).to.have.property('uiSchema');
    expect(result.schema).to.have.property('properties');

    // The original properties should still be present
    expect(result.schema.properties).to.have.property('veteranFullName');
    expect(result.schema.properties).to.have.property(
      'veteranSocialSecurityNumber',
    );
  });
});

describe('Edu 1995 form validation with updated required fields', () => {
  it('should enforce veteranSocialSecurityNumber as required', async () => {
    const result = applicantInformationField();

    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={result.schema}
        data={{}}
        definitions={definitions}
        uiSchema={result.uiSchema}
      />,
    );

    submitForm(form);

    await waitFor(() => {
      const errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        form,
        'usa-input-error-message',
      );

      // Verify SSN error is shown
      expect(
        errors.find(input =>
          input.id.includes('root_veteranSocialSecurityNumber'),
        ),
      ).to.be.ok;
    });
  });

  it('should validate all required fields including veteranFullName and dateOfBirth', async () => {
    const result = applicantInformationField();

    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={result.schema}
        data={{}}
        definitions={definitions}
        uiSchema={result.uiSchema}
      />,
    );

    submitForm(form);

    await waitFor(() => {
      const errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        form,
        'usa-input-error-message',
      );

      // Should have multiple validation errors for all required fields
      expect(errors.length).to.be.greaterThan(0);

      // Check for specific required field errors
      const errorIds = errors.map(e => e.id).join(',');
      expect(errorIds).to.include('veteranSocialSecurityNumber');
    });
  });

  it('should not show SSN error when view:noSSN is checked', async () => {
    const result = applicantInformationField();

    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={result.schema}
        data={{ 'view:noSSN': true }}
        definitions={definitions}
        uiSchema={result.uiSchema}
      />,
    );

    submitForm(form);

    await waitFor(() => {
      const errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        form,
        'usa-input-error-message',
      );

      // SSN should not be required when view:noSSN is checked
      expect(
        errors.find(input =>
          input.id.includes('root_veteranSocialSecurityNumber'),
        ),
      ).not.to.be.ok;

      // But VA file number should be required
      expect(errors.find(input => input.id.includes('root_vaFileNumber'))).to.be
        .ok;
    });
  });
});
