import {
  testNumberOfErrorsOnSubmit,
  testNumberOfWebComponentFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

[
  'preparerQualifications1A',
  'preparerQualifications1B',
  'preparerQualifications1C',
  'preparerQualifications1D',
].forEach(page => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.preparerQualificationsChapter.pages[page];

  const pageTitle = 'preparer qualifications 1';

  const expectedNumberOfFields = 4;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  /* test for widget errors instead of
  web component errors because error
  shows up as alert instead of node label. */
  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
