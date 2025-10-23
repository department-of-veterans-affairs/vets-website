import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    secondaryCaregiverInformation: {
      pages: { secondaryTwoContactInformation },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = secondaryTwoContactInformation;

// run test for correct number of fields on the page
const expectedNumberOfFields = 3;
testNumberOfFormFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
