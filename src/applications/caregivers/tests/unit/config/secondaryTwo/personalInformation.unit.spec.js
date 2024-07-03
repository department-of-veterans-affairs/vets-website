import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    secondaryCaregiverInformation: {
      pages: { secondaryTwoPersonalInformation },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = secondaryTwoPersonalInformation;

// run test for correct number of fields on the page
const expectedNumberOfWebComponentFields = 7;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfWebComponentErrors = 4;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);
