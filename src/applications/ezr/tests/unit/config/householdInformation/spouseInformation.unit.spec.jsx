import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

// Test spouseInformationSummary page.
const {
  chapters: {
    householdInformation: {
      pages: { spouseInformationSummary },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = spouseInformationSummary;

// Run test for correct number of fields on the page.
const expectedNumberOfWebComponentFields = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

// Run test for correct number of error messages on submit.
const expectedNumberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);
