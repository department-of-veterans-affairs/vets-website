import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';
import dependentFinancialSupport from '../../../../config/chapters/householdInformation/dependentFinancialSupport';

const { schema, uiSchema } = dependentFinancialSupport;
const pageTitle = 'Dependent financial support';

// run test for correct number of fields on the page
const expectedNumberOfFields = 2;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
