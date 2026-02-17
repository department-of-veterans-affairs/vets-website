import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../config/form';
import { noSSNTitle } from '../../pages/sponsorInfomartion';

const definitions = formConfig.defaultDefinitions;

describe('Edu 1995 sponsorInformation', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.sponsorInformation.pages.sponsorInformation;
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
    expect(inputs.length).to.equal(5);
  });
});

describe('noSSNTitle', () => {
  it('should always return "I don\'t know my sponsor\'s Social Security number"', () => {
    expect(noSSNTitle()).to.equal(
      "I don't know my sponsor's Social Security number",
    );
  });
});

describe('VA File Number Conditional Display', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.sponsorInformation.pages.sponsorInformation;

  it('should not display the VA file number input field when noSSN is false', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{ 'view:noSSN': false }}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    );

    // Should have 5 inputs: first, middle, last, suffix, and noSSN checkbox
    // SSN field is conditional and not shown by default
    expect(inputs.length).to.equal(5);

    // Verify no VA file number input is present
    const vaFileInputs = inputs.filter(
      input =>
        input.name?.includes('vaFileNumber') ||
        input.id?.includes('vaFileNumber'),
    );
    expect(vaFileInputs.length).to.equal(0);
  });

  it('should display the VA file number input field when noSSN is checked', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{ 'view:noSSN': true }}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    );

    // Should have 6 inputs: first, middle, last, suffix, vaFileNumber, and noSSN checkbox
    expect(inputs.length).to.equal(6);

    // Verify there is an input with name or id containing 'vaFileNumber'
    const vaFileInputs = inputs.filter(
      input =>
        input.name?.includes('vaFileNumber') ||
        input.id?.includes('vaFileNumber'),
    );
    expect(vaFileInputs.length).to.equal(1);
  });

  it('should include vaFileNumber in the form schema properties', () => {
    expect(schema.properties).to.have.property('vaFileNumber');
  });

  it('should include vaFileNumber in the form schema definitions', () => {
    expect(schema.definitions).to.have.property('vaFileNumber');
  });

  it('should contain vaFileNumber in the uiSchema', () => {
    expect(uiSchema).to.have.property('vaFileNumber');
  });

  it('should have vaFileNumber with expandUnder option set to view:noSSN', () => {
    expect(uiSchema.vaFileNumber['ui:options']).to.have.property(
      'expandUnder',
      'view:noSSN',
    );
  });

  it('should require vaFileNumber when noSSN is checked', () => {
    const isRequired = uiSchema.vaFileNumber['ui:required'];
    expect(isRequired).to.be.a('function');
    expect(isRequired({ 'view:noSSN': true })).to.be.true;
    expect(isRequired({ 'view:noSSN': false })).to.be.false;
  });

  it('should not require vaFileNumber when SSN is provided', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{
          sponsorFullName: {
            first: 'John',
            last: 'Doe',
          },
          sponsorSocialSecurityNumber: '123456789',
          'view:noSSN': false,
        }}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );

    const formData = form.props.data;

    // SSN should be present, vaFileNumber should not be required
    expect(formData).to.have.property('sponsorSocialSecurityNumber');
    expect(formData['view:noSSN']).to.be.false;
  });

  it('should include vaFileNumber field in form data when noSSN is checked', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{
          sponsorFullName: {
            first: 'Jane',
            last: 'Smith',
          },
          'view:noSSN': true,
          vaFileNumber: 'c12345678',
        }}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );

    const formData = form.props.data;

    // Should have sponsorFullName, view:noSSN, and vaFileNumber
    expect(formData).to.have.property('sponsorFullName');
    expect(formData).to.have.property('view:noSSN', true);
    expect(formData).to.have.property('vaFileNumber', 'c12345678');
  });
});
