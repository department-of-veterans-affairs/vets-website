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

// The page has 4 fields: firstName, middleName, lastName, dateOfBirth
const numberOfWebComponentFields = 4;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

// According to PRD: firstName, lastName and dateOfBirth are required, so 3 validation errors expected
const numberOfWebComponentErrors = 3;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
