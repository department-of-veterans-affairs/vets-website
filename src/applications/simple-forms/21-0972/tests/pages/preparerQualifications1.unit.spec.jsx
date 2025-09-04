import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
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

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
