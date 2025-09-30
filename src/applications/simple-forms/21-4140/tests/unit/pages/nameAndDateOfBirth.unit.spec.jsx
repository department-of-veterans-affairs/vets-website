import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformationChapter.pages.nameAndDateOfBirth;

const pageTitle = 'nameAndDateOfBirth';

// The page has 5 fields: firstName, middleName, lastName, suffix, dateOfBirth
const numberOfWebComponentFields = 5;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

// According to PRD: firstName and lastName are required, so 2 validation errors expected
const numberOfWebComponentErrors = 2;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
