import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    secondaryCaregiverInformation: {
      pages: { secondaryTwoMailingAddress },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = secondaryTwoMailingAddress;

// run test for correct number of fields on the page
const expectedNumberOfFields = 7;
testNumberOfFormFields(
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
