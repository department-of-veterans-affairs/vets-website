import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    householdInformation: {
      pages: { deductibleExpenses },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = deductibleExpenses;

// run test for correct number of fields on the page
const expectedNumberOfFields = 3;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfErrors = 3;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
