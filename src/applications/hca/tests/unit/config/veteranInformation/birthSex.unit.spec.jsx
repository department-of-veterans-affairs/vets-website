import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';

describe('hca VeteranBirthSex config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.birthSex;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 2;
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
});
