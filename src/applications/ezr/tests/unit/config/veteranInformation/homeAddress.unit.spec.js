import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    veteranInformation: {
      pages: { homeAddress },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = homeAddress;

// run test for correct number of fields on the page
const expectedNumberOfFields = 7;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfErrors = 4;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
