import { expect } from 'chai';
import sinon from 'sinon';

import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const { schema, uiSchema } =
  formConfig.chapters.employmentChapter.pages.employed;

const pageTitle = 'employed';

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

describe(`employment validations`, () => {
  it('flags missing form data as an error', () => {
    const validation = uiSchema.employmentCertifications['ui:validations'][0];
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
    const validation = uiSchema.employmentCertifications['ui:validations'][0];
    const errors = {
      addError: sinon.spy(),
    };
    validation(errors, {
      employmentCertification: true,
      employmentAccuracyCertification: false,
    });
    expect(errors.addError.calledOnce).to.be.true;
    expect(
      errors.addError.calledWith(
        'You must check both certifications to continue',
      ),
    );
  });
});
