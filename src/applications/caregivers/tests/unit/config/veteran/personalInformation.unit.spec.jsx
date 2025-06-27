import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    veteranInformation: {
      pages: { vetPersonalInformation },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = vetPersonalInformation;

// run test for correct number of fields on the page
const expectedNumberOfFields = 6;
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
