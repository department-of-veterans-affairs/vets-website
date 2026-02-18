import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.identificationInformationChapter.pages.identificationInformation;

const pageTitle = 'identificationInformation';

// The page has 3 fields: socialSecurityNumber, vaFileNumber, militaryServiceNumber
const numberOfWebComponentFields = 3;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

// According to PRD: socialSecurityNumber is required, so 1 validation error expected
const numberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
