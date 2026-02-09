import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../helpers.spec';

import formConfig from '../../../../config/form';

describe('ezr Toxic Exposure config', () => {
  const {
    schema,
    uiSchema,
    title: pageTitle,
  } = formConfig.chapters.militaryService.pages.toxicExposure;
  const expectedNumberOfFields = 1;
  const expectedNumberOfSubmissionErrors = 0;

  // run test for correct number of fields on the page
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfSubmissionErrors,
    pageTitle,
  );
});
