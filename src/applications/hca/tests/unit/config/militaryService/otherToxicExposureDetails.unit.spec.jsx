import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';

describe('hca Other Toxic Exposure Details config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.otherToxicExposureDetails;

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
});
