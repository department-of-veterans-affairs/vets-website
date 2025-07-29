import {
  testNumberOfWebComponentFields,
  testComponentFieldsMarkedAsRequired,
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
  testSubmitsWithoutErrors,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import medicalExpenses from '../../../../config/chapters/05-financial-information/medicalExpenses';

const { schema, uiSchema } = medicalExpenses;

describe('Medical expenses pension page', () => {
  const pageTitle = 'Care expenses';
  const expectedNumberOfFields = 0;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 0;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  const expectedNumberOfWebComponentFields = 6;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      `va-radio[label="Who is the expense for?"]`,
      `va-text-input[label="Who receives the payment?"]`,
      `va-text-input[label="What’s the payment for?"]`,
      `va-memorable-date[label="What’s the date of the payment?"]`,
      `va-radio[label="How often are the payments?"]`,
      `va-text-input[label="How much is each payment?"]`,
    ],
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 3,
      'va-memorable-date': 1,
      'va-radio': 2,
    },
    pageTitle,
  );
});
