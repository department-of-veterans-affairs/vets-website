import { expect } from 'chai';
import sinon from 'sinon';

import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const { schema, uiSchema } =
  formConfig.chapters.unemploymentChapter.pages.unemployed;

const pageTitle = 'unemployed';

// The page has a checkbox group with 2 individual checkboxes
const numberOfWebComponentFields = 2;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

// The page has 1 required field (the checkbox group), so 1 validation error expected when empty
const numberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);

describe(`Unemployment validations`, () => {
  it('flags missing form data as an error', () => {
    const validation = uiSchema.unemploymentCertifications['ui:validations'][0];
    const errors = {
      addError: sinon.spy(),
    };
    validation(errors, null);
    expect(errors.addError.calledOnce).to.be.true;
    expect(
      errors.addError.calledWith(
        'You must check both certifications to continue',
      ),
    );
  });

  it('flags missing both checkbox agreements as an error', () => {
    const validation = uiSchema.unemploymentCertifications['ui:validations'][0];
    const errors = {
      addError: sinon.spy(),
    };
    validation(errors, {
      unemploymentCertification: true,
      accuracyCertification: false,
    });
    expect(errors.addError.calledOnce).to.be.true;
    expect(
      errors.addError.calledWith(
        'You must check both certifications to continue',
      ),
    );
  });
});
