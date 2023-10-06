import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
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
const expectedNumberOfWebComponentFields = 1;
const expectedNumberOfFields = 7;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfWebComponentErrors = 1;
const expectedNumberOfErrors = 4;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
