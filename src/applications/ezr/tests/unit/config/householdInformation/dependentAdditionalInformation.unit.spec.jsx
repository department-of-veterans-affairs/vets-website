import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';
import dependentAddtlInformation from '../../../../config/chapters/householdInformation/dependentAdditionalInformation';

const { schema, uiSchema } = dependentAddtlInformation;
const pageTitle = 'Dependent additional information';

// run test for correct number of fields on the page
const expectedNumberOfWebComponentFields = 3;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfWebComponentErrors = 3;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);
