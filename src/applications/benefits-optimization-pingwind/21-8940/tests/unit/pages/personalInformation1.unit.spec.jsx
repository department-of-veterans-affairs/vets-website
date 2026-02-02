import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranIdInformationChapter.pages.personalInformation1;

const pageTitle = 'personal information 1';

// Name inputs (first, middle, last, suffix) plus a single va-date component
const numberOfWebComponentFields = 5;

testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

// Required errors surface on first name, last name, and date of birth
const numberOfWebComponentErrors = 3;

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
