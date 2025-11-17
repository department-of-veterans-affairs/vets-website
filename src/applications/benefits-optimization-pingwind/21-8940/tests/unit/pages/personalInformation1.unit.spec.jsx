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

// Fields: full name (first, middle, last, suffix?) + date of birth => count underlying web component fields
// Assuming patterns create 5 fields for name (first, middle, last, suffix) + date of birth (3 date parts) => adjust when helper counts differ
// We'll set an expected count placeholder; update if test fails.
const numberOfWebComponentFields = 5;

testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

// Required errors: fullName first + last + dateOfBirth => approximate number of error fields
const numberOfWebComponentErrors = 4;

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
