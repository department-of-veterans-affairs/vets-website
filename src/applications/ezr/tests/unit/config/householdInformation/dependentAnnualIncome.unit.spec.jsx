import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';
import dependentAnnualIncome from '../../../../config/chapters/householdInformation/dependentAnnualIncome';

const { schema, uiSchema } = dependentAnnualIncome;
const pageTitle = 'Dependent annual income';

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
