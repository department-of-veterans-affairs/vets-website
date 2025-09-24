import {
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
  testComponentFieldsMarkedAsRequired,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import mailingAddress from '../../../../config/chapters/01-applicant-information/mailingAddress';

const { schema, uiSchema } = mailingAddress;

describe('pension mailing address page', () => {
  const pageTitle = 'mailing address';
  const expectedNumberOfFields = 7;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      `va-select[label="Country"]`,
      `va-text-input[label="Street address"]`,
      `va-text-input[label="City"]`,
      `va-text-input[label="Postal code"]`,
    ],
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 5,
      'va-select': 1,
      'va-checkbox': 1,
    },
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);
});
