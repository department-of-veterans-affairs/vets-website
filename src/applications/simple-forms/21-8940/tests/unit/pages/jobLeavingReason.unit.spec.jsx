import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.currentEmploymentChapter.pages.jobLeavingReason;

const pageTitle = 'jobLeavingReason';

const numberOfWebComponentFields = 1; // leftJobDueToDisability (explanationForLeaving is on a different page)
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

const numberOfWebComponentErrors = 1; // Only leftJobDueToDisability is always required
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
