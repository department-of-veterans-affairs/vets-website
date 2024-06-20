import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    veteranInformation: {
      pages: { mailingAddress },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = mailingAddress;

// run test for correct number of fields on the page
const expectedNumberOfWebComponentFields = 9;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfWebComponentErrors = 5;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);
