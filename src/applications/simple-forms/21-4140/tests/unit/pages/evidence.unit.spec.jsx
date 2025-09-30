import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const { schema, uiSchema } = formConfig.chapters.evidenceChapter.pages.evidence;

const pageTitle = 'evidence';

// The page has 0 detected web component fields (multiple file input may not be detected by test helper)
const numberOfWebComponentFields = 0;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

// The page has 0 required fields (file upload is optional), so 0 validation errors expected
const numberOfWebComponentErrors = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
