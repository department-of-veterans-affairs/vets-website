import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    secondaryCaregiverInformation: {
      pages: { secondaryOneIdentityInformation },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = secondaryOneIdentityInformation;

// run test for correct number of fields on the page
const expectedNumberOfFields = 1;
testNumberOfFormFields(
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
