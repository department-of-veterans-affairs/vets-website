import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    householdInformation: {
      pages: { spouseContactInformation },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = spouseContactInformation;

// run test for correct number of fields on the page
const expectedNumberOfFields = 8;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfErrors = 4;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
