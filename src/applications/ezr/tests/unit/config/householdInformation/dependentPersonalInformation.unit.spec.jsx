import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';
import dependentPersonalInformation from '../../../../config/chapters/householdInformation/dependentPersonalInformation';

const { schema, uiSchema } = dependentPersonalInformation;
const pageTitle = 'Dependent personal information';

// run test for correct number of fields on the page
const expectedNumberOfWebComponentFields = 8;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfWebComponentErrors = 6;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);
