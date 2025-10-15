import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.educationAndTrainingChapter.pages.educationLevel;

const pageTitle = 'educationLevel';

const numberOfWebComponentFields = 1; // educationLevel
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

const numberOfWebComponentErrors = 1; // educationLevel is required
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
