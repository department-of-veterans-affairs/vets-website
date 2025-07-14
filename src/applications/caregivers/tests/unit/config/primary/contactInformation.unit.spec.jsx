import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    primaryCaregiverInformation: {
      pages: { primaryContactInformation },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = primaryContactInformation;

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
