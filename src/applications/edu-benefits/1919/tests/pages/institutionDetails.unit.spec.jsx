import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const definitions = formConfig.defaultDefinitions;
describe('22-1919 Institution Details page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.institutionDetails;
  delete uiSchema.institutionDetails.institutionName;
  delete schema.properties.institutionDetails.properties.institutionName;
  delete uiSchema.institutionDetails.institutionAddress;
  delete schema.properties.institutionDetails.properties.institutionAddress;

  it('renders the correct amount of inputs', () => {
    const { container } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(container.querySelectorAll('va-text-input').length).to.equal(1);
  });
  it('should validate facility code length', () => {
    const errors = {
      addError: message => {
        errors.messages.push(message);
      },
      messages: [],
    };

    const validateFacilityCode =
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .uiSchema.institutionDetails.facilityCode['ui:validations'][0];
    validateFacilityCode(errors, '1234567');
    expect(errors.messages).to.include(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );

    errors.messages = [];
    validateFacilityCode(errors, '12345678');
    expect(errors.messages).to.be.empty;
  });
});
