import {
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
  testComponentFieldsMarkedAsRequired,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import contactInformation from '../../../../config/chapters/01-applicant-information/contactInformation';

const { schema, uiSchema } = contactInformation;

describe('pension contact information page', () => {
  const pageTitle = 'Email address and phone number';
  const expectedNumberOfFields = 4;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 4,
    },
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [`va-text-input[label="Email"]`, `va-text-input[label="Mobile number"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);
});
