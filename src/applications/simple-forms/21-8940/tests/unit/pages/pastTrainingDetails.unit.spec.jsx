import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.educationAndTrainingChapter.pages.pastTrainingDetails;

const pageTitle = 'pastTrainingDetails';

const numberOfWebComponentFields = 3; // trainingType, trainingStartDate, trainingCompletionDate
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

const numberOfWebComponentErrors = 3; // All 3 fields are required
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
