import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    veteranInformation: {
      pages: { vetIdentityInformation },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = vetIdentityInformation;

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
const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
