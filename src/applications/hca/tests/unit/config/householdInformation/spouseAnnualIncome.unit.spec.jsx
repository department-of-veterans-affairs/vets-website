import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';

describe('hca SpouseAnnualIncome config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.SpouseAnnualIncome;

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
  const expectedNumberOfErrors = 3;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
