import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';
import dependentEducationExpenses from '../../../../config/chapters/householdInformation/dependentEducationExpenses';

const { schema, uiSchema } = dependentEducationExpenses;
const pageTitle = 'Dependent education expenses';

// run test for correct number of web component error messages on submit
const expectedNumberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);

// run test for correct number of standard fields on the page
const expectedNumberOfFields = 2;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

// run test for correct number of standard error messages on submit
const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
